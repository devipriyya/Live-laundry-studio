import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
              <h1 className="text-2xl font-bold text-red-900 mb-2">Something went wrong</h1>
              <p className="text-red-700">A React component error occurred</p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Error Details:</h3>
              <pre className="text-sm text-red-800 whitespace-pre-wrap overflow-auto">
                {this.state.error && this.state.error.toString()}
              </pre>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Component Stack:</h3>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-40">
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
