Vue.component('sidenav', {
    template: 
        `<ul id="slide-out" class="sidenav sidenav-fixed">
            <li><slot></slot></li>
        </ul>`
})

Vue.component('filetree', {
    props: ['filetree', 'recursive', 'focused'],
    name: 'filetree',
    template: `<ul v-bind:class="{inset: recursive}"><filelisting v-for="file in filetree" v-bind:file="file" v-bind:key="file.id" v-bind:focused="focused"></filelisting></ul>`
})


Vue.component('filelisting', {
    props: ['file', 'focused'], 
    methods: {
        add: (file) => {
            app.createFile(file);
        }, 
        del: (file) => {
            app.removeFile(file);
        }, 
        edit: (file) => {
            const title = prompt("Enter a new file title for " + file.title);
            if(!title) return;
            app.setFileTitle(file, title);
        }, 
        open: (file) => {
            app.openFile(file);
        }
    },
    template: 
    `<li>
        <a href="#!" data-action="pad" v-on:click="open(file)" v-bind:class="{selected: (focused && file.id==focused.id)}">
            <i class="material-icons right nm" v-on:click.stop="edit(file)">edit</i>
            <i class="material-icons right nm" v-on:click.stop="add(file)">add</i>
            <i class="material-icons right nm" v-on:click.stop="del(file)">delete</i>
            {{file.title}}
        </a>
        <filetree v-if="file.sub" v-bind:filetree="file.sub" recursive="true" v-bind:focused="focused"></filetree>
    </li>`
})


Vue.component('tabbar', {
    props: ['files', 'focused'], 
    methods: {
      
        close: (file) => {
            app.closeFile(file);
        }, 
        focus: (file) => {
            app.focusFile(file);
        }
    },
    template: 
        `<ul class="tabs" v-if="files">
            <mobilesidenavbtn></mobilesidenavbtn>
            <li v-for="file in files" class="tab" v-bind:class="{selected: (focused && file.id == focused.id)}">
                <a href="#" v-bind:class="{active: focused && file.id==focused.id}" 
                    v-bind:key="file.id"
                    v-on:click="focus(file)">
                        {{file.title}}
                        <i class="material-icons tiny tabbtn" v-on:click="close(file)">close</i>
                </a>
            </li>
        </ul>`
})


Vue.component('padframes', {
    props: ['files', 'focused'], 
    computed: {
        rooturl: () => {
            return app.padBaseURL;
        }
    },
    template: 
    `<div class="pad-frame">
        <div v-for="file in files" 
            class="col s12 pad-frame" 
            v-bind:key="file.id"
            v-show="(focused && file.id == focused.id)">
        <iframe class="pad-frame" v-bind:src="rooturl + '/p/' + file.id"></iframe>
    </div></div>`
})


Vue.component('wsheader', {
    props: ['title'], 
    methods: {
        rename: () => {
            const n = prompt('Please enter a new name.')
            if(!n) return;
            app.renameWorkspace(n);
        }
    },
    template: 
    `<li id="side-header">
        <div class="user-view">
            <div class="background red darken-3">
                
            </div>
            <a class="waves-effect waves-light btn-flat white-text large name" v-on:click="rename"><i class="material-icons right">edit</i>{{title}}</a>
            <a ><span class="white-text email">Workspace</span></a>
        </div>
    </li>`
})

Vue.component('hintpage', {
    props: ['title'],
    template: 
    `<div class="pad-frame"><div class="container">
        <h1>Welcome to {{title}}!</h1>
        <p class="flow-text">
            Select or create a file on the left to get started and open it in this editor window. 
        </p>
    </div></div>`
})


Vue.component('createrootbtn', 
{
    methods: {
        create: () => {
            app.createFile();
        }
    },
    template: 
    `<a class="waves-effect waves-red btn grey lighten-2 center" v-on:click="create()">
        <i class="material-icons center center-btn red-text">add</i>
    </a>`
})


Vue.component('mobilesidenavbtn', {
    template: 
        `<li class="tab hide-on-large-only menubtn" id="menutbn"><a href="#" data-target="slide-out" class="sidenav-trigger tab-container">
            <i class="material-icons tabbtn menubtn">menu</i>
        </a></li>`
})