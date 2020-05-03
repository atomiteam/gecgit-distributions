const { exec } = nw.require('child_process');
const fs = nw.require('fs');
// Default Gecgit plugins

// Shell plugin allows executing notes in terminal
const shell = {
        execute: function(args) {
            this._execute(args.code.split('\n'), args.out);
        },
        _execute: function(commands, out){
            const command = commands.shift();
            const _ = this;
            exec(command, (error, stdout, stderr) => {
              out.log(`Executing\n${command}`);
              if (error) {
                out.error(error);
                return;
              }
              if(stdout) out.log(stdout);
              if(stderr) out.error(stderr);
              if(commands.length) _._execute(commands, out)
            });
        }
     }

// Local storage plugin
// If enabled, authentication and cloud storage features of
// Gecgit are disabled.
// The user opens the application without login and notes
// are stored in local disk.
const storage  = {
    read(){
        try{
            return JSON.parse(fs.readFileSync('store.json'));  
        }catch(e){
            return {};
        }
    },
    write(items){
        fs.writeFileSync('store.json', JSON.stringify(items))
    },
    list(args){
        console.log(`list ${JSON.stringify(args)}`);
        const _ = this;
        return new Promise(function(accept){
            try{
                const items = Object.values(_.read());
                const filtered = args.q ? items.filter( i=> i.content.contains(args.q)) : items;
                accept({data: filtered});
            }catch(e){
                accept({data: []});
            }
        });
    },
    create(post){
        console.log(`create ${JSON.stringify(post)}`);
        post.id = `id:${new Date().getTime()}`;
        return this.update(post);
    },
    update(post){
        console.log(`update ${JSON.stringify(post)}`);
        const _ = this;
        return new Promise(function(accept){
            const items = _.read();
            items[post.id] = post;
            _.write(items);
            accept({data: post});
        });
    },
    remove(post){
        console.log(`remove ${JSON.stringify(post)}`);
        const _ = this;
        return new Promise(function(accept){
            const items = _.read();
            delete items[post.id];
            _.write(items);
            accept({data: post});
        });
    }
}

window.gecgit = {
    plugins: {
        shell: shell,
        // Uncomment below line if you want local storage
        //storage: storage
    }
}

