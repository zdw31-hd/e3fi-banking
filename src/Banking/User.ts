class User {
    private readonly id: string;
    private name: string;
    private email: string;
  
    constructor(name: string, email: string) {
      this.id = User.generateId();
      this.name = name;
      this.email = email;
    }
  
    private static generateId(): string {
      return `U-${Math.random().toString(36).substring(2, 10)}`;
    }
  
    public getId(): string {
      return this.id;
    }
  
    public getName(): string {
      return this.name;
    }
  
    public getEmail(): string {
      return this.email;
    }
  
    public setName(name: string): void {
      this.name = name;
    }
  
    public setEmail(email: string): void {
      this.email = email;
    }
  }