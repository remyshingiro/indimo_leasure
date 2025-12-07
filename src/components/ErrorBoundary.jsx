import React from 'react'
import { Link } from 'react-router-dom'
import useLanguageStore from '../stores/languageStore'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console (in production, send to error tracking service)
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // In production, send to error tracking service (e.g., Sentry, LogRocket)
    // if (process.env.NODE_ENV === 'production') {
    //   errorTrackingService.logError(error, errorInfo)
    // }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    })
  }

  render() {
    if (this.state.hasError) {
      // Get language from store without hook (since this is a class component)
      let language = 'en'
      try {
        language = useLanguageStore.getState().language
      } catch {
        // Fallback if store not available
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {language === 'en' ? 'Something went wrong' : 'Ikintu cyabaye'}
            </h1>
            <p className="text-gray-600 mb-6">
              {language === 'en' 
                ? 'We apologize for the inconvenience. An error occurred while loading this page.'
                : 'Tubabarira ubwoba. Ikosa ryabaye mugihe twongeraga kurukurikirana.'
              }
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-gray-100 p-4 rounded text-sm">
                <summary className="cursor-pointer font-semibold mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="overflow-auto text-xs">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition"
              >
                {language === 'en' ? 'Try Again' : 'Gerageza Nanone'}
              </button>
              <Link
                to="/"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition"
              >
                {language === 'en' ? 'Go Home' : 'Subira Ahabanza'}
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

