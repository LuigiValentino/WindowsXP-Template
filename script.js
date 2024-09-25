    let highestZIndex = 100;
        function updateClock() {
        const clock = document.getElementById('taskbar-clock');
        const now = new Date();
        clock.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        setInterval(updateClock, 1000);
        updateClock();
        
        const audioPlayer = document.getElementById('audioPlayer');
        const progressBar = document.getElementById('progress');
        const currentTimeDisplay = document.getElementById('current-time');
        const totalTimeDisplay = document.getElementById('total-time');
        const songTitle = document.getElementById('song-title');
        
        function playMusic() {
        audioPlayer.play();
        }
        
        function pauseMusic() {
        audioPlayer.pause();
        }
        
        function stopMusic() {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        updateProgress();
        }
        
        function loadSong(songPath) {
        audioPlayer.src = songPath;
        audioPlayer.load();
        songTitle.textContent = songPath.split('/').pop().replace('.mp3', '');
        audioPlayer.onloadedmetadata = function() {
            totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
        };
        playMusic();
        }
        
        function updateProgress() {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = progress + '%';
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        }
        
        function setVolume(volume) {
        audioPlayer.volume = volume;
        }
        
        audioPlayer.addEventListener('timeupdate', updateProgress);
        
        function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const windowSelector = icon.getAttribute('data-window');
            const win = document.querySelector(windowSelector);
            win.style.display = 'block';
            win.style.zIndex = ++highestZIndex;
            addToTaskbar(windowSelector, icon.querySelector('span').innerText, icon.querySelector('img').src);
        });
        });

        document.querySelectorAll('.window').forEach(win => {
        win.addEventListener('mousedown', () => {
            win.style.zIndex = ++highestZIndex;
        });
        });

        document.querySelectorAll('.title-bar-controls .close').forEach(button => {
        button.addEventListener('click', (e) => {
            const win = e.target.closest('.window');
            win.style.display = 'none';
            removeFromTaskbar('#' + win.id);
        });
        });

        function addToTaskbar(windowSelector, title, iconSrc) {
        if (document.querySelector(`.taskbar-item[data-window="${windowSelector}"]`)) return;
        const taskbarItem = document.createElement('div');
        taskbarItem.classList.add('taskbar-item');
        taskbarItem.setAttribute('data-window', windowSelector);
        const icon = document.createElement('img');
        icon.src = iconSrc;
        const span = document.createElement('span');
        span.innerText = title;
        taskbarItem.appendChild(icon);
        taskbarItem.appendChild(span);
        document.querySelector('.taskbar-items').appendChild(taskbarItem);
        taskbarItem.addEventListener('click', () => {
            const win = document.querySelector(windowSelector);
            if (win.style.display === 'none') {
            win.style.display = 'block';
            win.style.zIndex = ++highestZIndex;
            } else {
            win.style.display = 'none';
            }
        });
        }

        function removeFromTaskbar(windowSelector) {
        const taskbarItem = document.querySelector(`.taskbar-item[data-window="${windowSelector}"]`);
        if (taskbarItem) {
            taskbarItem.remove();
        }
        }

        interact('.window')
        .draggable({
            allowFrom: '.title-bar',
            listeners: {
            move(event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
            }
        })
        .resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: {
            move(event) {
                const target = event.target;
                let x = parseFloat(target.getAttribute('data-x')) || 0;
                let y = parseFloat(target.getAttribute('data-y')) || 0;
                target.style.width = `${event.rect.width}px`;
                target.style.height = `${event.rect.height}px`;
                x += event.deltaRect.left;
                y += event.deltaRect.top;
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
            },
            modifiers: [
            interact.modifiers.restrictEdges({
                outer: 'parent'
            }),
            interact.modifiers.restrictSize({
                min: { width: 200, height: 100 }
            })
            ],
            inertia: true
        });