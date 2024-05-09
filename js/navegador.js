const enter = document.querySelector('.keyenter');

enter.addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('active');
});
/*
enter.addEventListener('keyup', function(){
    document.getElementById('sidebar').classList.toggle('pressed');
});*/

