import React from "react";

export class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    return this.state.error ? (
      <main className="container section">
        <h1>No pudimos cargar la página</h1>
        <p role="alert">{this.state.error.message}</p>
        <button className="btn btn-lime" onClick={() => location.reload()}>
          Volver a intentar
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}