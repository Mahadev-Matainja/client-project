import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string; // <-- add for RoleGuard
      subType?: string; // <-- add for RoleGuard

      data: {
        customer: {
          id: number;
          first_name: string;
          last_name: string;
          email: string;
          mobile: string;
          dob: string;
          gender: string;
          type: string; // <-- this becomes role
          subType?: string; // <-- add if backend returns it
          permissions?: string[];
          avatar: string | null;
          lang: string;
          is_active?: number;
          created_at: string;
          updated_at: string;
          details: any;
        };

        token: string;
        access_token?: string;
        refresh_token?: string;
        token_type?: string;
        expires_in?: number;
      };
    };
  }

  interface User {
    data?: {
      customer?: {
        type?: string;
        subType?: string;
        permissions?: string[];
      };
      token?: string;
    };
  }
}
