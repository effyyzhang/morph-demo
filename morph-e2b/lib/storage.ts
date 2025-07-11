// Simple in-memory storage for development
class AppStorage {
  private code: string = '';
  
  setCode(code: string) {
    this.code = code;
    console.log('Storage: Code saved, length:', code.length);
  }
  
  getCode(): string {
    console.log('Storage: Code retrieved, length:', this.code.length);
    return this.code;
  }
  
  hasCode(): boolean {
    return this.code.length > 0;
  }
  
  clear() {
    this.code = '';
    console.log('Storage: Code cleared');
  }
}

// Create a singleton instance
const storage = new AppStorage();

export default storage;