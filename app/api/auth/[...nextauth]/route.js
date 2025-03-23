import NextAuth from "next-auth";
import { authOptions } from "../../../../config/authOptions";


// ✅ Correct export for App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
// export default handler; 
