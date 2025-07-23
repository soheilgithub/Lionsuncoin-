import { useState, useEffect, useCallback } from 'react';
import GamepadManager from '../utils/GamepadManager';

/**
 * React Hook for Cross-Platform Gamepad Support
 * Provides easy integration with PS5, Xbox, Switch, PSP controllers
 */
export const useGamepad = (options = {}) => {
  const [connectedControllers, setConnectedControllers] = useState([]);
  const [buttonStates, setButtonStates] = useState({});
  const [axisStates, setAxisStates] = useState({});
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('getGamepads' in navigator);
    
    if (!isSupported) return;

    // Event handlers
    const handleControllerConnected = (event) => {
      const { controllerId, controllerType } = event.detail;
      setConnectedControllers(GamepadManager.getConnectedControllers());
      
      if (options.onConnect) {
        options.onConnect(event.detail);
      }
    };

    const handleControllerDisconnected = (event) => {
      const { controllerId } = event.detail;
      setConnectedControllers(GamepadManager.getConnectedControllers());
      
      // Clean up states for disconnected controller
      setButtonStates(prev => {
        const newStates = { ...prev };
        delete newStates[controllerId];
        return newStates;
      });
      
      setAxisStates(prev => {
        const newStates = { ...prev };
        delete newStates[controllerId];
        return newStates;
      });
      
      if (options.onDisconnect) {
        options.onDisconnect(event.detail);
      }
    };

    const handleButtonDown = (event) => {
      const { controllerId, button, value } = event.detail;
      setButtonStates(prev => ({
        ...prev,
        [controllerId]: {
          ...prev[controllerId],
          [button]: { pressed: true, value }
        }
      }));
      
      if (options.onButtonDown) {
        options.onButtonDown(event.detail);
      }
    };

    const handleButtonUp = (event) => {
      const { controllerId, button } = event.detail;
      setButtonStates(prev => ({
        ...prev,
        [controllerId]: {
          ...prev[controllerId],
          [button]: { pressed: false, value: 0 }
        }
      }));
      
      if (options.onButtonUp) {
        options.onButtonUp(event.detail);
      }
    };

    const handleAxisMove = (event) => {
      const { controllerId, axis, value } = event.detail;
      setAxisStates(prev => ({
        ...prev,
        [controllerId]: {
          ...prev[controllerId],
          [axis]: value
        }
      }));
      
      if (options.onAxisMove) {
        options.onAxisMove(event.detail);
      }
    };

    // Add event listeners
    window.addEventListener('gamepadconnected', handleControllerConnected);
    window.addEventListener('gamepaddisconnected', handleControllerDisconnected);
    window.addEventListener('gamepadbuttondown', handleButtonDown);
    window.addEventListener('gamepadbuttonup', handleButtonUp);
    window.addEventListener('gamepadaxismove', handleAxisMove);

    // Initialize with currently connected controllers
    setConnectedControllers(GamepadManager.getConnectedControllers());

    return () => {
      window.removeEventListener('gamepadconnected', handleControllerConnected);
      window.removeEventListener('gamepaddisconnected', handleControllerDisconnected);
      window.removeEventListener('gamepadbuttondown', handleButtonDown);
      window.removeEventListener('gamepadbuttonup', handleButtonUp);
      window.removeEventListener('gamepadaxismove', handleAxisMove);
    };
  }, [isSupported, options]);

  // Helper functions
  const isButtonPressed = useCallback((button, controllerId = null) => {
    if (controllerId !== null) {
      return buttonStates[controllerId]?.[button]?.pressed || false;
    }
    
    // Check all controllers
    return Object.values(buttonStates).some(
      controller => controller[button]?.pressed
    );
  }, [buttonStates]);

  const getAxisValue = useCallback((axis, controllerId = null) => {
    if (controllerId !== null) {
      return axisStates[controllerId]?.[axis] || 0;
    }
    
    // Return first non-zero axis value
    for (const controller of Object.values(axisStates)) {
      const value = controller[axis];
      if (value && Math.abs(value) > 0.1) return value;
    }
    return 0;
  }, [axisStates]);

  const isActionPressed = useCallback((action, controllerId = null) => {
    return GamepadManager.isActionPressed(action, controllerId);
  }, []);

  const getMovementInput = useCallback((controllerId = null) => {
    return GamepadManager.getMovementInput(controllerId);
  }, []);

  const vibrate = useCallback((controllerId, pattern, options = {}) => {
    GamepadManager.vibrate(controllerId, pattern, options);
  }, []);

  const setLightbar = useCallback((controllerId, color) => {
    GamepadManager.setLightbar(controllerId, color);
  }, []);

  const setAdaptiveTriggers = useCallback((controllerId, leftForce, rightForce) => {
    GamepadManager.setAdaptiveTriggers(controllerId, leftForce, rightForce);
  }, []);

  return {
    // State
    connectedControllers,
    buttonStates,
    axisStates,
    isSupported,
    
    // Helper functions
    isButtonPressed,
    getAxisValue,
    isActionPressed,
    getMovementInput,
    
    // Controller features
    vibrate,
    setLightbar,
    setAdaptiveTriggers
  };
};

/**
 * Specialized hook for game controls
 */
export const useGameControls = (options = {}) => {
  const gamepad = useGamepad(options);
  const [playerInput, setPlayerInput] = useState({
    movement: { x: 0, y: 0 },
    camera: { x: 0, y: 0 },
    actions: {
      jump: false,
      attack: false,
      defend: false,
      special: false,
      pause: false
    }
  });

  useEffect(() => {
    const updateInput = () => {
      if (!gamepad.isSupported) return;

      const movement = gamepad.getMovementInput();
      
      const actions = {
        jump: gamepad.isActionPressed('jump'),
        attack: gamepad.isActionPressed('attack'),
        defend: gamepad.isActionPressed('defend'),
        special: gamepad.isActionPressed('special'),
        pause: gamepad.isActionPressed('pause')
      };

      setPlayerInput({
        movement: movement.movement,
        camera: movement.camera,
        actions
      });
    };

    const interval = setInterval(updateInput, 16); // 60 FPS
    return () => clearInterval(interval);
  }, [gamepad]);

  return {
    ...gamepad,
    playerInput
  };
};

/**
 * Hook for controller-specific UI interactions
 */
export const useControllerUI = () => {
  const gamepad = useGamepad();
  const [uiNavigation, setUINavigation] = useState({
    selectedIndex: 0,
    canNavigate: true
  });

  const [navigationCooldown, setNavigationCooldown] = useState(false);

  useEffect(() => {
    if (!gamepad.isSupported) return;

    const handleUINavigation = () => {
      if (navigationCooldown) return;

      let selectedIndex = uiNavigation.selectedIndex;
      let navigated = false;

      // D-pad navigation
      if (gamepad.isButtonPressed('dpad_up')) {
        selectedIndex = Math.max(0, selectedIndex - 1);
        navigated = true;
      } else if (gamepad.isButtonPressed('dpad_down')) {
        selectedIndex += 1; // Max would be set by component
        navigated = true;
      }

      if (navigated) {
        setUINavigation(prev => ({ ...prev, selectedIndex }));
        setNavigationCooldown(true);
        setTimeout(() => setNavigationCooldown(false), 200);
      }
    };

    const interval = setInterval(handleUINavigation, 50);
    return () => clearInterval(interval);
  }, [gamepad, uiNavigation.selectedIndex, navigationCooldown]);

  const confirmSelection = useCallback(() => {
    return gamepad.isActionPressed('confirm');
  }, [gamepad]);

  const cancelSelection = useCallback(() => {
    return gamepad.isActionPressed('cancel');
  }, [gamepad]);

  return {
    ...gamepad,
    uiNavigation,
    confirmSelection,
    cancelSelection,
    setSelectedIndex: (index) => setUINavigation(prev => ({ ...prev, selectedIndex: index }))
  };
};