const {exec} = nw.require('child_process');
const fs = nw.require('fs');

// Shell plugin allows executing notes in terminal
class Shell{
    execute(args) {
        this._execute(args.code.split('\n'), args.out);
    }
    _execute(commands, out) {
        const command = commands.shift();
        const _ = this;
        exec(command, (error, stdout, stderr) => {
            out.log(`Executing\n${command}`);
            if (error) {
                out.error(error);
                return;
            }
            if (stdout) out.log(stdout);
            if (stderr) out.error(stderr);
            if (commands.length) _._execute(commands, out)
        });
    }
}

// Minimal local storage implementation of Storage interface
const UpdatedAtComparator = function(a, b){
    return a.updatedAt - b.updatedAt;
}

class Storage {
    async list(args) {
        const items = this._read(args);
        return {
            data: Object.values(items).filter(i => {
                if (args.q) {
                    return i.content.includes(args.q);
                } else {
                    return true;
                }
            }).sort(UpdatedAtComparator)
        };
    }
    async create(post) {
        const posts = this._read();
        post.updatedAt = new Date();
        post.id = `id:${new Date().toLocaleString()}`;
        posts[post.id] = post;
        this._write(posts);
        return {
            data: post
        };
    }
    async remove(post) {
        const posts = this._read();
        delete posts[post.id];
        this._write(posts);
        return {
            data: post
        };
    }
    async update(post) {
        const posts = this._read();
        posts[post.id] = post;
        post.updatedAt = new Date();
        this._write(posts);
        return {
            data: post
        };
    }
    _read() {
        try {
            return JSON.parse(fs.readFileSync('store.json'));
        } catch (e) {
            return {};
        }
    }
    _write(items) {
        fs.writeFileSync('store.json', JSON.stringify(items))
    }
}

// Minimal no authentication implementation of Authentication interface
class Authentication{
    get token(){
        return '';
    }
    get local(){
        return {};
    }
    isAuthenticated() {
        return true;
    }
    authenticate() {
        window.location = '/posts';
    }
}

const shell = new Shell(), 
    authentication = new Authentication(), 
    storage = new Storage();

window.gecgit = {
    plugins: {
        shell,
        // Uncomment below line if local storage is desired
        //storage,
        //authentication
    }
}