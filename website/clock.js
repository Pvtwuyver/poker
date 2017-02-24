var Poker = (function () {
  var round = 1,
      duration = 900,
      timer = duration,
      blinds = [{
        small: 5,
        big: 10
      }, {
        small: 10,
        big: 20
      }, {
        small: 15,
        big: 30
      }, {
        small: 20,
        big: 40
      }, {
        small: 25,
        big: 50
      }, {
        small: 50,
        big: 100
      }, {
        small: 75,
        big: 150
      }, {
        small: 100,
        big: 200
      }, {
        small: 150,
        big: 300
      }, {
        small: 200,
        big: 400
      }, {
        small: 300,
        big: 600
      }, {
        small: 400,
        big: 800
      }, {
        small: 500,
        big: 1000
      }, {
        small: 600,
        big: 1200
      }, {
        small: 800,
        big: 1600
      }, {
        small: 1000,
        big: 2000
      }],
      interval_id;
  
  return {
    isGamePaused: function () {
      return !interval_id ? true : false;
    },
    playAlarm: function () {
      $('#alarm')[0].play();
    },
    reset: function () {
      // reset timer
      this.resetTimer();
      
      this.stopClock();
      
      this.updateClock(timer);
      
      // reset play/pause button
      this.updatePlayPauseButton();
      
      // reset round
      round = 1;
      
      this.updateRound(round);
      
      // increase blinds
      this.updateBlinds(round);
    },
    resetTimer: function () {
      timer = duration;
    },
    startClock: function () {
      var that = this;
      
      interval_id = setInterval(function () {
        that.updateClock(timer);
        
        timer -= 1;
      }, 1000);
    },
    startNextRound: function () {
      // reset timer
      this.resetTimer();
      
      this.stopClock();
      
      this.updateClock(timer);
      
      // reset play/pause button
      this.updatePlayPauseButton();
      
      // increase round
      round += 1;
      
      this.updateRound(round);
      
      // increase blinds
      this.updateBlinds(round);
    },
    stopClock: function () {
      clearInterval(interval_id);
      interval_id = undefined;
    },
    updateBlinds: function (round) {
      var round_blinds = blinds[round - 1] || blinds[blinds.length];
      
      $('.small-blind').html(round_blinds.small);
      $('.big-blind').html(round_blinds.big);
    },
    updateClock: function (timer) {
      var minute = Math.floor(timer / 60),
          second = (timer % 60) + "",
          second = second.length > 1 ? second : "0" + second;
        
      $('.clock').html(minute + ":" + second);
      
      if (timer <= 0) {
        this.startNextRound();
        
        this.playAlarm();
        
        this.startClock();
        
        // update play/pause button
        this.updatePlayPauseButton();
      }
    },
    updatePlayPauseButton: function () {
      var pause_play_button = $('#poker_play_pause a');
      
      if (this.isGamePaused()) {
        pause_play_button.removeClass('pause');
        pause_play_button.addClass('play');
      } else {
        pause_play_button.removeClass('play');
        pause_play_button.addClass('pause');
      }
    },
    updateRound: function (round) {
      $('#round').html('Round' + ' ' + round);
    }
  };
}());

$('#poker_play_pause').on('click', function (event) {
  if (Poker.isGamePaused()) {
    Poker.startClock();
  } else {
    Poker.stopClock();
  }
  
  // update play/pause button
  Poker.updatePlayPauseButton();
});

$('#poker_next_round').on('click', function (event) {
  Poker.startNextRound();
});

$('body').on('keypress', function (event) {
  if (Poker.isGamePaused()) {
    Poker.startClock();
  } else {
    Poker.stopClock();
  }
  
  // update play/pause button
  Poker.updatePlayPauseButton();
});


$('.reset').on('click', function (event) {
  Poker.reset();
});