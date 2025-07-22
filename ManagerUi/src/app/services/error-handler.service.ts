import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  getErrorMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      // Server-side errors
      if (error.error?.businessErrorDescription) {
        return error.error.businessErrorDescription;
      }
      
      switch (error.status) {
        case 400:
          return 'Invalid request. Please check your input and try again.';
        case 401:
          return 'You are not authorized. Please login again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'A conflict occurred. This item may already exist.';
        case 422:
          return 'The data provided is invalid. Please check your input.';
        case 500:
          return 'A server error occurred. Please try again later.';
        case 503:
          return 'Service is temporarily unavailable. Please try again later.';
        default:
          return `An error occurred (${error.status}). Please try again.`;
      }
    }
    
    // Client-side errors
    if (error?.message) {
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  }

  getSuccessMessage(action: string, item: string = 'item'): string {
    switch (action) {
      case 'create':
        return `${item} created successfully!`;
      case 'update':
        return `${item} updated successfully!`;
      case 'delete':
        return `${item} deleted successfully!`;
      case 'activate':
        return `${item} activated successfully!`;
      case 'deactivate':
        return `${item} deactivated successfully!`;
      default:
        return 'Operation completed successfully!';
    }
  }
}