import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.gradients.primary};
  color: ${props => props.theme.colors.text};
  padding: 2rem;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.8;
`;

const ErrorTitle = styled.h1`
  color: ${props => props.theme.colors.error};
  font-size: 2rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.125rem;
  line-height: 1.6;
  max-width: 600px;
  margin-bottom: 2rem;
`;

const ErrorDetails = styled.details`
  margin-bottom: 2rem;
  max-width: 800px;
  width: 100%;
  
  summary {
    color: ${props => props.theme.colors.accent};
    cursor: pointer;
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    margin-bottom: 1rem;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

const ErrorStack = styled.pre`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  text-align: left;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button`
  background: ${props => props.theme.gradients.accent};
  color: ${props => props.theme.colors.primary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.animations.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
  }
`;

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error);
      console.error('Error info:', errorInfo);
    }

    // In production, you might want to log to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ErrorIcon>🦁💥</ErrorIcon>
            <ErrorTitle>Oops! Something went wrong</ErrorTitle>
            <ErrorMessage>
              We're sorry, but something unexpected happened. Don't worry, 
              your progress is safe and you can try again.
            </ErrorMessage>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <ErrorDetails>
                <summary>Technical Details (Development Mode)</summary>
                <ErrorStack>
                  <strong>Error:</strong> {this.state.error.message}
                  {this.state.error.stack && (
                    <>
                      <br />
                      <br />
                      <strong>Stack Trace:</strong>
                      <br />
                      {this.state.error.stack}
                    </>
                  )}
                  {this.state.errorInfo && (
                    <>
                      <br />
                      <br />
                      <strong>Component Stack:</strong>
                      <br />
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </ErrorStack>
              </ErrorDetails>
            )}

            <ButtonGroup>
              <Button onClick={this.handleRetry}>
                Try Again
              </Button>
              <Button onClick={this.handleReload}>
                Reload Page
              </Button>
              <SecondaryButton onClick={this.handleGoHome}>
                Go Home
              </SecondaryButton>
            </ButtonGroup>
          </motion.div>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;