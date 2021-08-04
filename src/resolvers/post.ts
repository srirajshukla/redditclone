import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Resolver, Query, Ctx, Int, Arg, Mutation } from "type-graphql";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(@Ctx() ctx: MyContext ) : Promise<Post[]> {
        return ctx.em.find(Post, {});
    }

    @Query(() => Post, {nullable: true})
    post(
        @Arg("id", ()=>Int) _id: number,
        @Ctx() ctx: MyContext 
    ) : Promise<Post | null> {
        return ctx.em.findOne(Post, {_id});
    }

    @Mutation(() => Post)
    async createPost(
        @Arg("title") title: string,
        @Ctx() ctx: MyContext 
    ) : Promise<Post> {
        const post = ctx.em.create(Post, {title});
        await ctx.em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg("id") _id: number,
        @Arg("title", ()=>String, {nullable: true}) title: string,
        @Ctx() ctx: MyContext 
    ) : Promise<Post | null> {
        const post = await ctx.em.findOne(Post, {_id});
        if (!post){
            return null;
        }
        if (typeof title!== undefined){
            post.title = title;
            await ctx.em.persistAndFlush(post);
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") _id: number,
        @Ctx() ctx: MyContext 
    ) : Promise<Boolean> {
        try {
            await ctx.em.nativeDelete(Post, {_id});
            return true;
        } catch{
            return false;
        }
    }
}