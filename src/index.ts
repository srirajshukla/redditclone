import "reflect-metadata";
import {MikroORM} from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from './mikro-orm.config'
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
const port = 3000;

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator( ).up();

    const app = express();
    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false,
        }),
        context: () => ({em: orm.em }),
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({app});
    
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
    // const post = orm.em.create(Post, {title: "this is SOME post"});
    // await orm.em.persistAndFlush(post);
    const post = await orm.em.find(Post, {});
    console.log(post);
};  

console.log("%c Hello World", "color: blue")
console.log("seccond")

main().catch((err) => {
    console.error(err);
});