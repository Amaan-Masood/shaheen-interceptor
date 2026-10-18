import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-[#1A1016] border border-[#EF4444]/50 rounded-xl text-center space-y-3 m-4">
          <AlertTriangle className="w-8 h-8 text-[#EF4444] mx-auto animate-pulse" />
          <div className="font-bold text-white text-sm">
            {this.props.fallbackTitle || "Something went wrong loading this section."}
          </div>
          <div className="text-xs text-[#94A3B8] max-w-md mx-auto">
            {this.state.error?.message || "An unexpected error occurred."}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-3.5 py-1.5 bg-[#334155] hover:bg-[#475569] text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Section</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
