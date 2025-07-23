/**
 * GamepadManager - Cross-Platform Controller Input System
 * Supports PS5 DualSense, Xbox Series X/S, Nintendo Switch Pro, PSP
 */

class GamepadManager {
  constructor() {
    this.gamepads = {};
    this.controllers = new Map();
    this.isActive = false;
    this.updateInterval = null;
    this.vibrationSupported = false;
    
    // Controller mapping configurations
    this.controllerMappings = {
      // PlayStation 5 DualSense
      'DualSense': {
        vendor: '054c',
        product: '0ce6',
        buttons: {
          0: 'cross',      // X button
          1: 'circle',     // O button  
          2: 'square',     // Square button
          3: 'triangle',   // Triangle button
          4: 'l1',         // L1
          5: 'r1',         // R1
          6: 'l2',         // L2
          7: 'r2',         // R2
          8: 'share',      // Share button
          9: 'options',    // Options button
          10: 'l3',        // Left stick click
          11: 'r3',        // Right stick click
          12: 'dpad_up',   // D-pad up
          13: 'dpad_down', // D-pad down
          14: 'dpad_left', // D-pad left
          15: 'dpad_right',// D-pad right
          16: 'ps',        // PS button
          17: 'touchpad'   // Touchpad click
        },
        axes: {
          0: 'left_x',     // Left stick X
          1: 'left_y',     // Left stick Y
          2: 'right_x',    // Right stick X
          3: 'right_y',    // Right stick Y
          4: 'l2_analog',  // L2 analog
          5: 'r2_analog'   // R2 analog
        },
        hapticFeedback: true,
        adaptiveTriggers: true,
        lightbar: true
      },
      
      // Xbox Series X/S Controller
      'Xbox': {
        vendor: '045e',
        product: ['02ea', '0b12', '0b13'],
        buttons: {
          0: 'a',          // A button
          1: 'b',          // B button
          2: 'x',          // X button
          3: 'y',          // Y button
          4: 'lb',         // Left bumper
          5: 'rb',         // Right bumper
          6: 'lt',         // Left trigger
          7: 'rt',         // Right trigger
          8: 'view',       // View button
          9: 'menu',       // Menu button
          10: 'ls',        // Left stick click
          11: 'rs',        // Right stick click
          12: 'dpad_up',   // D-pad up
          13: 'dpad_down', // D-pad down
          14: 'dpad_left', // D-pad left
          15: 'dpad_right',// D-pad right
          16: 'xbox'       // Xbox button
        },
        axes: {
          0: 'left_x',     // Left stick X
          1: 'left_y',     // Left stick Y
          2: 'right_x',    // Right stick X
          3: 'right_y',    // Right stick Y
          4: 'lt_analog',  // Left trigger analog
          5: 'rt_analog'   // Right trigger analog
        },
        hapticFeedback: true,
        impulseSupported: true
      },
      
      // Nintendo Switch Pro Controller
      'SwitchPro': {
        vendor: '057e',
        product: '2009',
        buttons: {
          0: 'b',          // B button (bottom)
          1: 'a',          // A button (right)
          2: 'y',          // Y button (left)
          3: 'x',          // X button (top)
          4: 'l',          // L button
          5: 'r',          // R button
          6: 'zl',         // ZL button
          7: 'zr',         // ZR button
          8: 'minus',      // Minus button
          9: 'plus',       // Plus button
          10: 'ls',        // Left stick click
          11: 'rs',        // Right stick click
          12: 'dpad_up',   // D-pad up
          13: 'dpad_down', // D-pad down
          14: 'dpad_left', // D-pad left
          15: 'dpad_right',// D-pad right
          16: 'home',      // Home button
          17: 'capture'    // Capture button
        },
        axes: {
          0: 'left_x',     // Left stick X
          1: 'left_y',     // Left stick Y
          2: 'right_x',    // Right stick X
          3: 'right_y'     // Right stick Y
        },
        hapticFeedback: true,
        gyroscope: true,
        accelerometer: true
      },
      
      // PSP (via emulation/adapter)
      'PSP': {
        vendor: '054c',
        product: '01c4',
        buttons: {
          0: 'cross',      // X button
          1: 'circle',     // O button
          2: 'square',     // Square button
          3: 'triangle',   // Triangle button
          4: 'l',          // L button
          5: 'r',          // R button
          6: 'select',     // Select button
          7: 'start',      // Start button
          8: 'dpad_up',    // D-pad up
          9: 'dpad_down',  // D-pad down
          10: 'dpad_left', // D-pad left
          11: 'dpad_right' // D-pad right
        },
        axes: {
          0: 'analog_x',   // Analog stick X
          1: 'analog_y'    // Analog stick Y
        },
        hapticFeedback: false
      }
    };
    
    this.gameMapping = {
      // Universal game actions mapped to controller inputs
      actions: {
        'jump': ['cross', 'a', 'b', 'cross'],           // PS5, Xbox, Switch, PSP
        'attack': ['square', 'x', 'y', 'square'],       // Primary attack
        'defend': ['circle', 'b', 'a', 'circle'],       // Block/defend
        'special': ['triangle', 'y', 'x', 'triangle'],  // Special ability
        'pause': ['options', 'menu', 'plus', 'start'], // Pause game
        'back': ['share', 'view', 'minus', 'select'],  // Back/cancel
        'confirm': ['cross', 'a', 'a', 'cross'],       // Confirm action
        'cancel': ['circle', 'b', 'b', 'circle']       // Cancel action
      },
      movement: {
        'move': 'left_stick',     // Character movement
        'camera': 'right_stick',  // Camera control
        'dpad': 'dpad'           // Menu navigation
      }
    };
    
    this.init();
  }
  
  init() {
    if (!('getGamepads' in navigator)) {
      console.warn('Gamepad API not supported');
      return;
    }
    
    // Check for vibration support
    this.vibrationSupported = 'vibrate' in navigator;
    
    // Setup event listeners
    window.addEventListener('gamepadconnected', this.onGamepadConnected.bind(this));
    window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected.bind(this));
    
    console.log('GamepadManager initialized - Cross-platform support ready');
  }
  
  onGamepadConnected(event) {
    const gamepad = event.gamepad;
    const controllerType = this.detectControllerType(gamepad);
    
    console.log(`Controller connected: ${gamepad.id} (${controllerType})`);
    
    this.controllers.set(gamepad.index, {
      gamepad,
      type: controllerType,
      mapping: this.controllerMappings[controllerType] || this.controllerMappings['Xbox'],
      lastButtonState: new Array(gamepad.buttons.length).fill(false),
      lastAxisState: new Array(gamepad.axes.length).fill(0),
      vibrationEnabled: true
    });
    
    if (!this.isActive) {
      this.start();
    }
    
    // Trigger connection event
    this.dispatchControllerEvent('connected', {
      controllerId: gamepad.index,
      controllerType,
      gamepad
    });
  }
  
  onGamepadDisconnected(event) {
    const gamepad = event.gamepad;
    console.log(`Controller disconnected: ${gamepad.id}`);
    
    this.controllers.delete(gamepad.index);
    
    if (this.controllers.size === 0) {
      this.stop();
    }
    
    // Trigger disconnection event
    this.dispatchControllerEvent('disconnected', {
      controllerId: gamepad.index,
      gamepad
    });
  }
  
  detectControllerType(gamepad) {
    const id = gamepad.id.toLowerCase();
    
    // PlayStation 5 DualSense
    if (id.includes('dualsense') || id.includes('054c:0ce6')) {
      return 'DualSense';
    }
    
    // Xbox controllers
    if (id.includes('xbox') || id.includes('045e:')) {
      return 'Xbox';
    }
    
    // Nintendo Switch Pro Controller
    if (id.includes('pro controller') || id.includes('057e:2009')) {
      return 'SwitchPro';
    }
    
    // PSP (via adapter)
    if (id.includes('psp') || id.includes('054c:01c4')) {
      return 'PSP';
    }
    
    // Default to Xbox mapping for unknown controllers
    return 'Xbox';
  }
  
  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.updateInterval = setInterval(() => {
      this.update();
    }, 16); // ~60 FPS
    
    console.log('GamepadManager started');
  }
  
  stop() {
    if (!this.isActive) return;
    
    this.isActive = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    console.log('GamepadManager stopped');
  }
  
  update() {
    const gamepads = navigator.getGamepads();
    
    for (const controller of this.controllers.values()) {
      const gamepad = gamepads[controller.gamepad.index];
      if (!gamepad) continue;
      
      // Update button states
      this.updateButtons(controller, gamepad);
      
      // Update axis states
      this.updateAxes(controller, gamepad);
    }
  }
  
  updateButtons(controller, gamepad) {
    const { mapping } = controller;
    
    gamepad.buttons.forEach((button, index) => {
      const wasPressed = controller.lastButtonState[index];
      const isPressed = button.pressed;
      
      if (isPressed !== wasPressed) {
        const buttonName = mapping.buttons[index];
        if (buttonName) {
          this.dispatchControllerEvent(isPressed ? 'buttondown' : 'buttonup', {
            controllerId: gamepad.index,
            controllerType: controller.type,
            button: buttonName,
            buttonIndex: index,
            value: button.value
          });
        }
      }
      
      controller.lastButtonState[index] = isPressed;
    });
  }
  
  updateAxes(controller, gamepad) {
    const { mapping } = controller;
    
    gamepad.axes.forEach((value, index) => {
      const lastValue = controller.lastAxisState[index];
      const deadzone = 0.1; // Adjust deadzone as needed
      
      // Apply deadzone
      const processedValue = Math.abs(value) < deadzone ? 0 : value;
      
      if (Math.abs(processedValue - lastValue) > 0.01) {
        const axisName = mapping.axes[index];
        if (axisName) {
          this.dispatchControllerEvent('axismove', {
            controllerId: gamepad.index,
            controllerType: controller.type,
            axis: axisName,
            axisIndex: index,
            value: processedValue
          });
        }
      }
      
      controller.lastAxisState[index] = processedValue;
    });
  }
  
  // Vibration/Haptic Feedback
  vibrate(controllerId, pattern, options = {}) {
    const controller = this.controllers.get(controllerId);
    if (!controller || !controller.vibrationEnabled) return;
    
    const gamepad = navigator.getGamepads()[controllerId];
    if (!gamepad) return;
    
    // Modern Gamepad Haptic API
    if (gamepad.hapticActuators && gamepad.hapticActuators.length > 0) {
      const actuator = gamepad.hapticActuators[0];
      
      if (controller.type === 'DualSense') {
        // PS5 DualSense advanced haptics
        actuator.pulse(pattern.intensity || 0.5, pattern.duration || 100);
      } else if (controller.type === 'Xbox') {
        // Xbox controller impulse triggers
        if (gamepad.vibrationActuator) {
          gamepad.vibrationActuator.playEffect('dual-rumble', {
            duration: pattern.duration || 100,
            strongMagnitude: pattern.strong || 0.5,
            weakMagnitude: pattern.weak || 0.3
          });
        }
      }
    }
    
    // Fallback to navigator.vibrate for mobile/basic support
    if (this.vibrationSupported && pattern.mobile !== false) {
      navigator.vibrate(pattern.duration || 100);
    }
  }
  
  // Game Action Mapping
  isActionPressed(action, controllerId = null) {
    const controllers = controllerId !== null 
      ? [this.controllers.get(controllerId)].filter(Boolean)
      : Array.from(this.controllers.values());
    
    for (const controller of controllers) {
      const gamepad = navigator.getGamepads()[controller.gamepad.index];
      if (!gamepad) continue;
      
      const actionButtons = this.getActionButtons(action, controller.type);
      for (const buttonName of actionButtons) {
        const buttonIndex = this.getButtonIndex(buttonName, controller.mapping);
        if (buttonIndex !== -1 && gamepad.buttons[buttonIndex]?.pressed) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  getActionButtons(action, controllerType) {
    const actionMap = this.gameMapping.actions[action];
    if (!actionMap) return [];
    
    const typeIndex = ['DualSense', 'Xbox', 'SwitchPro', 'PSP'].indexOf(controllerType);
    return typeIndex !== -1 ? [actionMap[typeIndex]] : [actionMap[1]]; // Default to Xbox
  }
  
  getButtonIndex(buttonName, mapping) {
    for (const [index, name] of Object.entries(mapping.buttons)) {
      if (name === buttonName) return parseInt(index);
    }
    return -1;
  }
  
  // Movement and Camera Controls
  getMovementInput(controllerId = null) {
    const controllers = controllerId !== null 
      ? [this.controllers.get(controllerId)].filter(Boolean)
      : Array.from(this.controllers.values());
    
    let movement = { x: 0, y: 0 };
    let camera = { x: 0, y: 0 };
    
    for (const controller of controllers) {
      const gamepad = navigator.getGamepads()[controller.gamepad.index];
      if (!gamepad) continue;
      
      // Left stick for movement
      const leftX = gamepad.axes[0] || 0;
      const leftY = gamepad.axes[1] || 0;
      
      // Right stick for camera
      const rightX = gamepad.axes[2] || 0;
      const rightY = gamepad.axes[3] || 0;
      
      // Apply deadzone
      if (Math.abs(leftX) > 0.1 || Math.abs(leftY) > 0.1) {
        movement.x = leftX;
        movement.y = leftY;
      }
      
      if (Math.abs(rightX) > 0.1 || Math.abs(rightY) > 0.1) {
        camera.x = rightX;
        camera.y = rightY;
      }
    }
    
    return { movement, camera };
  }
  
  // Controller-specific features
  setLightbar(controllerId, color) {
    const controller = this.controllers.get(controllerId);
    if (!controller || controller.type !== 'DualSense') return;
    
    // PS5 DualSense lightbar control (requires WebHID API)
    console.log(`Setting lightbar color: ${color} for controller ${controllerId}`);
  }
  
  setAdaptiveTriggers(controllerId, leftForce, rightForce) {
    const controller = this.controllers.get(controllerId);
    if (!controller || controller.type !== 'DualSense') return;
    
    // PS5 DualSense adaptive triggers (requires WebHID API)
    console.log(`Setting adaptive triggers: L:${leftForce}, R:${rightForce}`);
  }
  
  // Utility Methods
  getConnectedControllers() {
    return Array.from(this.controllers.entries()).map(([id, controller]) => ({
      id,
      type: controller.type,
      name: controller.gamepad.id
    }));
  }
  
  dispatchControllerEvent(type, data) {
    const event = new CustomEvent(`gamepad${type}`, { detail: data });
    window.dispatchEvent(event);
  }
  
  destroy() {
    this.stop();
    window.removeEventListener('gamepadconnected', this.onGamepadConnected);
    window.removeEventListener('gamepaddisconnected', this.onGamepadDisconnected);
    this.controllers.clear();
    console.log('GamepadManager destroyed');
  }
}

// Export singleton instance
export default new GamepadManager();