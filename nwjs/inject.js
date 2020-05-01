const { exec } = nw.require('child_process');
const fs = nw.require('fs');
// Default Gecgit plugins

// Shell plugin allows executing notes in terminal
var shell = {
        execute: function(args) {
            this._execute(args.code.split('\n'), args.out);
        },
        _execute: function(commands, out){
            var command = commands.shift();
            var _ = this;
            exec(command, (error, stdout, stderr) => {
              out.log(command);
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
var storage  = {
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
    list(){
        var _ = this;
        return new Promise(function(accept){
            try{
                accept({data: Object.values(_.read())});
            }catch(e){
                accept({data: []});
            }
        });
    },
    create(post){
        post.id = 'id:' + new Date().getTime();
        return this.update(post);
    },
    update(post){
        var _ = this;
        return new Promise(function(accept){
            var items = _.read();
            items[post.id] = post;
            _.write(items);
            accept({data: post});
        });
    },
    remove(post){
        var _ = this;
        return new Promise(function(accept){
            var items = _.read();
            delete items[post.id];
            _.write(items);
            accept({data: post});
        });
    }
}

window.gecgit = {
    plugins: {
        shell: shell
    }
}

