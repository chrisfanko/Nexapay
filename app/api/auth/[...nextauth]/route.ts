import NextAuth from "next-auth";
import User from "@/models/users";
import connectToDatabase from "@/lib/mongo_db";
import bcrypt from "bcryptjs";
import  CredentialsProvider  from "next-auth/providers/credentials";
import Github from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
   session :{
    strategy: "jwt",
   },
   providers : [
    
       GoogleProvider({
        clientId:process.env.AUTH_GOOGLE_ID!,
        clientSecret:process.env.AUTH_GOOGLE_SECRET!,
        authorization:{
            params:{
                 prompt: "consent",
          access_type: "offline",
          response_type: "code"
            }
        }
       }),
       Github({
         clientId:process.env.GITHUB_ID!,
         clientSecret:process.env.GITHUB_SECRET!,
       }),
    

       CredentialsProvider({
        name: "Credentials",
        credentials: {
            email:{
                label:"Email",
                type:"email"
            },
            password:{
                label:"Password",
                type:"password"
            },
        },
        async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });

        // user must exist AND must have a password
        if (!user || !user.password) return null;

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) return null;

        return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
        };
      },
    }),
  ], 
   callbacks: {
    async signIn({account, profile}) {
        if(account?.provider === "credentials") return true;
            await connectToDatabase();
            const existingUser = await User.findOne({email: profile?.email});
            if(!existingUser) {
                await User.create({
                    name: profile?.name,
                    email: profile?.email,
                })
            }
        
        return true;
    },

     

    async jwt({token , user}) {
        if (user) {
            token.id = user.id;
            token.email = user.email;
            token.name = user.name
        }
        return token;
    },
    async session ({session, token}){
        session.user = {
            email: token.email as string,
            name: token.name as string,
            image: token.picture as string || null,
        };
        return session;
    },
    
   },
   pages: {
    signIn: "/sign-in",

   },
   secret : process.env.NEXTAUTH_SECRET
});

export {handler as GET , handler as POST}
