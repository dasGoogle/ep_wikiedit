document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
})


window.onload = function () {


    // setup all the socketio stuff...
    socket = io()
    socket.on('workspace.update:' + getUrlItems().workspaceName, function (updateEvent) {
        state = updateEvent
        app.filetree = state.pads
        app.title = state.title
    })

    // really join the workspace
    socket.emit('workspace.join', getUrlItems().workspaceName)
}

function getUrlItems() {
    var items = location.pathname.split('/');
    console.log(items);
    return {
        workspaceName: items[2].toLowerCase(),
        padId: items[3]
    };
}


var app = new Vue({
    el: '#app',
    data: {
        filetree: [],
        title: '',
        padBaseURL: 'http://localhost:9001',
        openFiles: [],
        focused: undefined
    },
    methods: {
        createFile: function (parentFile, newTitle, sub) {
            const e = this;
            newTitle = newTitle || prompt('Please enter a name for the new file. ');
            if (!newTitle) return;
            newTitle = newTitle.replace('.', '')
            sub = sub || this.filetree;
            if (!parentFile) {
                const file = { 'title': newTitle, 'id': 'workspace:' + getUrlItems().workspaceName + '.' + encodeURIComponent(newTitle) }
                sub.push(file);
                e.pushState()
                e.openFile(file)
                return;
            }

            sub.forEach(function (pad) {
                if (pad.id == parentFile.id) {
                    if (!pad.sub) {
                        pad.sub = [];
                    }
                    const file = { 'title': newTitle, 'id': parentFile.id + '.' + encodeURIComponent(newTitle) }
                    pad.sub.push(file);
                    e.pushState()
                    e.openFile(file)
                    return;
                } else if (pad.sub) {
                    e.createFile(parentFile, newTitle, pad.sub);
                }
            });
        },
        removeFile: function (file, tree) {
            this.closeFile(file);
            const fileid = file.id;
            const e = this;
            const filetree = tree || this.filetree;
            filetree.forEach(function (pad) {
                if (pad.id == fileid) {
                    filetree.splice(filetree.indexOf(pad), 1);
                    e.pushState();
                    return;
                } else if (pad.sub) {
                    e.removeFile(file, pad.sub);
                }
            });
        },
        pushState: function () {
            const state = {
                pads: this.filetree,
                title: this.title
            }
            socket.emit('workspace.update', state)
        },
        openFile: function (file) {
            console.log('opening file: ', file.title)
            if (!file) return;
            if (this.indexOfFile(file, this.openFiles) < 0) {
                this.openFiles.push(file)
                this.focusFile(file);
            } else {
                this.focusFile(file);
            }
        },
        closeFile: function (file) {
            console.log('closing file: ', file.title)
            
            const index = this.indexOfFile(file, this.openFiles);
            
            let openFiles = this.openFiles;
            if (index > -1) {
                openFiles.splice(index, 1);
            }
            this.openFiles = openFiles;
            this.focusFile(this.openFiles[0])

        },
        focusFile: function (file) {
            if (this.indexOfFile(file, this.openFiles) < 0) return;
            this.focused = file;
        },
        indexOfFile: function(obj, list) {
            var i;
            for (i = 0; i < list.length; i++) {
                if (list[i].id == obj.id) {
                    return i;
                }
            }
        
            return -1;
        }, 
        setFileTitle(pad, title, padsList) {
          
            const padId = pad.id;
            const e = this;
            padsList = padsList || this.filetree;
            padsList.forEach(function (pad) {
                
                if (pad.id == padId) {
                    
                    pad.title = title;
                  
                    e.pushState();
                } else if (pad.sub) {
                    e.setFileTitle(pad, title, pad.sub);
                }
            });
        },
        renameWorkspace: function(newName) {
            this.title = newName; 
            this.pushState();
        }
    }
})


window.app = app;