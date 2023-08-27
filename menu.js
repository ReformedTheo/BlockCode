//We add blocks to the menu using menuItem(name, fn, value, contents) which takes a
//normal block, associates it with a function, and puts in the menu column.

(function(global){
    'use strict';


    var menu = document.querySelector('.menu');
	var script = document.querySelector('.script');
	var scriptRegistry = {};
	var scriptDirty = false;

	function runSoon(){ scriptDirty = true; }

function menuItem(name, fn, value, units){
    var item = Block.create(name, value, units);
    scriptRegistry[name] = fn;
    menu.appendChild(item);
    return item;
}



//We keep around references to menu and script because we use them a lot; no point hunting
//through the DOM for them over and over. We’ll also use scriptRegistry, where we store the
//scripts of blocks in the menu.
//We use scriptDirty to keep track of whether the script has been modified since the last time it
//was run, so we don’t keep trying to run it constantly.

function run(){
    if (scriptDirty){
        scriptDirty = false;
        Block.trigger('beforeRun', script);
        var blocks = [].slice.call(document.querySelectorAll('.script > .block'));
        Block.run(blocks);
        Block.trigger('afterRun', script);
    }else{
        Block.trigger('everyFrame', script);
    }
    requestAnimationFrame(run);
}
requestAnimationFrame(run);

function runEach(evt){
    var elem = evt.target;
    if (!matches(elem, '.script .block')) return;
    if (elem.dataset.name === 'Define block') return;
    elem.classList.add('running');
    scriptRegistry[elem.dataset.name](elem);
    elem.classList.remove('running');
}

function repeat(block){
    var count = Block.value(block);
    var children = Block.contents(block);
    for (var i = 0; i < count; i++){
        Block.run(children);
    }
}
menuItem('Repeat', repeat, 10, []);


global.Menu = {
    runSoon: runSoon,
    item: menuItem
};

document.addEventListener('drop', runSoon, false);
script.addEventListener('run', runEach, false);
script.addEventListener('change', runSoon, false);
script.addEventListener('keyup', runSoon, false);
})(window);
