# Gecgit Installations

Gecgit is a notebook application. You can save your notes and get back to them later.  

This repository contains desktop installation options together with basic Gecgit plugins.

## Installations

### Pure NWJS 

This is a pure nwjs installation package.  In order to start Gecgit, install Node.js and
execute these command under /nwjs

      
      npm install nw
      npm run start

## Plugins

Basic plugins can be found in inject.js. A plugin is a JavaScript object having following
interface.

	  // This example plugin prints out note body
      var print = {
          // This method contains the implementation.
          // The input argument args has these attributes:	
          //   code: Note body
          //   out: Console object to log back results which 
          //   has log, error, warn, info methods
          execute: function(args){
             console.log(args.code);
          }
      }
      
     // Let's register the plugin
     window.gecgit = {
          plugins: {print}
     }



      