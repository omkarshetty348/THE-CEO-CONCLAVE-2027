import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    roles?: string[];
    permissions?: string[];
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      roles?: string[];
      permissions?: string[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    roles?: string[];
    permissions?: string[];
  }
}
