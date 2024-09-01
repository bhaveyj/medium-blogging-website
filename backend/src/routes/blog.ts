import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";


interface JwtPayload extends JWTPayload {
    id: string;
}

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
    },
    Variables: {
        userId: string;
    }
}>();

blogRouter.use(async (c, next) => {
    const jwt = c.req.header('Authorization');
    if (!jwt) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
    const token = jwt.split(' ')[1];
    try {
        const payload = (await verify(token, c.env.JWT_SECRET)) as JwtPayload; // Use type assertion here
        if (!payload) {
            c.status(401);
            return c.json({ error: "Unauthorized" });
        }
        c.set('userId', payload.id); // This should now work correctly
        await next();
    } catch (error) {
        c.status(401);
        return c.json({ error: "Invalid token" });
    }
});

blogRouter.post('/', async (c) => {

    const userId = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const post = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: userId
        }
        
    });
    return c.json({
        id: post.id
    })
})

blogRouter.put('/', async (c) => {
    const userId = c.get('userId')

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    await prisma.post.update({
        where: {
            id: body.id,
            authorId: userId
        },

        data: {
            title: body.title,
            content: body.content,
        }
    })
    return c.text('Updated post');

})

blogRouter.get('/:id', async (c) => {
    const id = await c.req.param('id');
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const post = await prisma.post.findUnique({
        where: {
            id
        }
    });
    return c.json({
        post
    })
})

blogRouter.get('/api/v1/blog/bulk', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
	const posts = await prisma.post.findMany({});

	return c.json(posts);
})