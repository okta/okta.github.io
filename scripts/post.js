const yargs = require("yargs");
const fs = require("fs-extra");
const path = require("path");

const postsPath = path.join(__dirname, "..", "_source", "_posts");
const blogImagePath = path.join(__dirname, "..", "_source", "_assets", "img", "blog");
const defaultPostFrontMatter = `---
layout: blog_post
title: ""
author: 
description: ""
tags: []
tweets:
- ""
- ""
- ""
image: 
---
`

yargs.command("create [post-name] [format] [date]", "create a new blog post", yargs => {
    yargs.positional("post-name", {
        describe: "name of post",
        default: "new-post"
    }).positional("format", { 
        describe: "Format of file (md, adoc)",
        default: "md"
    }).positional("date", { 
        describe: "ISO date of post (e.g. 2019-09-01)",
        default: new Date().toISOString().substr(0, 10)
    });
})
    .command("stamp [date]", "update most recent post to given date (defaults to today)", yargs => {
        yargs.positional("date", {
            describe: "ISO date for post (e.g. 2019-09-01), defaults to today",
            default: new Date().toISOString().substr(0, 10)
        });
    })
    .demandCommand(1);

const createPost = async ( postName, date, format ) => {
    try {
        const postFile = `${date}-${postName}.${format}`;
        const postPath = path.join(postsPath, postFile);
        const imgPath = path.join(blogImagePath, postName);
        const exists = await fs.pathExists(postPath);
        if (!exists) {
            await fs.writeFile( postPath, defaultPostFrontMatter, { encoding: "UTF-8" } );
        }
        console.log( "image path:", imgPath);
        await fs.ensureDir(imgPath);
    } catch( err ) {
        console.log( "Error creating new post" );
        console.log( err );
    }
}

const stampPost = async ( date ) => {
    try {
        const files = await fs.readdir( postsPath );
        files.sort();
        const lastPost = files[files.length - 1];
        const updatedFileName = `${ date }${ lastPost.substr(10) }`
        if ( lastPost !== updatedFileName ) {
            console.log( `updating last post [${lastPost}] to [${updatedFileName}]...`);
            return await fs.rename( path.join(postsPath, lastPost), path.join(postsPath, updatedFileName));
        }
        console.log(`No need to rename ${ lastPost }`);
    } catch( err ) {
        console.log( "Error stamping latest post" );
        console.log( err );
    }
}

const main = async (argv) => {
    try {
        const cmd = argv._[0].toLowerCase();
    
        switch(cmd) {
            case "stamp":
                await stampPost( argv.date );
                break;
            case "create":
                await createPost( argv.postName, argv.date, argv.format );
                break;
            default:
                console.log("say what?");
                break;
        }
    } catch ( err ) {
        console.log( err );
    }
}

const argv = yargs.argv;

main(argv).then(() => console.log("finished"));
