$(function () {
    // Khai báo các object
    var container = $('#container');
    var bird = $('#bird');
    var pole = $('.pole');
    var pole_1 = $('#pole_1');
    var pole_2 = $('#pole_2');
    var score = $('#score');
    var level = $('#level');

    // Chuyển các thông tin của object sang dạng số thực
    var container_width = parseInt(container.width());
    var container_height = parseInt(container.height());
    var pole_initial_position = parseInt(pole.css('right'));
    var pole_initial_height = parseInt(pole.css('height'));
    var bird_left = parseInt(bird.css('left'));
    var bird_height = parseInt(bird.height());
    var speed = 10;

    // Một số trạng thái trong game
    var go_up = false;
    var score_updated = false;
    var game_over = false;
    var interval = 40;
    var game_interval;
    var current_score = 0; // Điểm khởi đầu

    // Hàm bắt đầu game
    function playGame() {
        game_interval = setInterval(function () {
            if (
                collision(bird, pole_1) ||
                collision(bird, pole_2) ||
                parseInt(bird.css('top')) <= 0 ||
                parseInt(bird.css('top')) > container_height - bird_height
            ) {
                stop_the_game();
            } else {
                var pole_current_position = parseInt(pole.css('right'));

                if (pole_current_position > container_width - bird_left) {
                    if (!score_updated) {
                        current_score += 1;
                        score.text(current_score);
                        score_updated = true;

                        // Cập nhật level và tốc độ dựa vào điểm số
                        if (current_score >= 50) {
                            alert('You Win!');
                            stop_the_game();
                            return;
                        } else if (current_score >= 40) {
                            updateLevel(4, 20);
                        } else if (current_score >= 20) {
                            updateLevel(3, 25);
                        } else if (current_score >= 5) {
                            updateLevel(2, 30);
                        }
                    }
                }

                if (pole_current_position > container_width) {
                    var new_height = parseInt(Math.random() * 100);
                    pole_1.css('height', pole_initial_height + new_height);
                    pole_2.css('height', pole_initial_height - new_height);
                    score_updated = false;
                    pole_current_position = pole_initial_position;
                }

                pole.css('right', pole_current_position + speed);

                if (!go_up) {
                    go_down();
                }
            }
        }, 100);
    }

    function updateLevel(new_level, new_interval) {
        level.text('Level: ' + new_level);
        interval = new_interval;
        clearInterval(game_interval);
        playGame();
    }

    // Hàm di chuyển chú chim rơi xuống
    function go_down() {
        bird.css('top', parseInt(bird.css('top')) + 10);
        bird.css('transform', 'rotate(50deg)');
    }

    // Hàm di chuyển chú chim bay lên
    function up() {
        bird.css('top', parseInt(bird.css('top')) - 20);
        bird.css('transform', 'rotate(-10deg)');
    }

    // Hàm thua game
    function stop_the_game() {
        clearInterval(game_interval);
        game_over = true;
        $('#restart_btn').slideDown();
    }

    // Hàm va chạm giữa 2 object
    function collision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;

        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        return !(b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2);
    }

    // Các sự kiện điều khiển
    $('#container').mousedown(function () {
        go_up = setInterval(up, 50);
    }).mouseup(function () {
        clearInterval(go_up);
        go_up = false;
    });

    $('#play_btn').click(function () {
        playGame();
        $(this).hide();
    });

    $('#restart_btn').click(function () {
        location.reload();
    });

    $(document).keydown(function (e) {
        if (e.key === "ArrowUp") go_up = setInterval(up, 50);
    }).keyup(function (e) {
        if (e.key === "ArrowUp") {
            clearInterval(go_up);
            go_up = false;
        }
    });
});
