import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { Hono } from "hono/tiny";
import { signupInput, signinInput } from "@bhaveyj/medium-blogging"
export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
}>();

// userRouter.post('/signup', async (c) => {
//     const body = await c.req.json();
//     const { success } = signupInput.safeParse(body);
//     if (!success) {
//       c.status(411);
//       return c.json({
//           message: "Inputs not correct"
//       })
//   }
//     const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate())

//   // const body = await c.req.json();
//     const user = await prisma.user.create({
//       data: {
//         name: body.name,
//         username: body.username,
//         password: body.password,
//       }
//     })
//     const token = await sign({
//       id: user.id
//     }, c.env.JWT_SECRET)

//     return c.json({
//       jwt: token
//     })
// })
userRouter.post('/signup', async (c) => {
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
      c.status(411);
      return c.json({
          message: "Inputs not correct"
      })
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
        name: body.name
      }
    })
    const jwt = await sign({
      id: user.id
    }, c.env.JWT_SECRET);

    return c.text(jwt)
  } catch(e) {
    console.log(e);
    c.status(411);
    return c.text('Invalid')
  }
})

userRouter.post('/signin', async (c) => {
  const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if (!success) {
      c.status(411);
      return c.json({
          message: "Inputs not correct"
      })
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  // const body = await c.req.json();
    const user = await prisma.user.findUnique({
      where: {
        username: body.username,
        password: body.password,
      }
    })
    if (!user) {
      c.status(403);
      return c.json({
        error: "user not found"
      })
    }
    const jwt = await sign({
      id: user.id
    }, c.env.JWT_SECRET)

    return c.json({
      jwt: jwt,
      userId: user.id // Returning the user ID (authorId) directly
    });
})