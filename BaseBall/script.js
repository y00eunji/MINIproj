(() => {
  "use strict";

  const get = (target) => document.querySelector(target);

  const init = () => {
    get("form").addEventListener("submit", (event) => {
      playGame(event);
    });
    setPassword();
  };

  const baseball = {
    limit: 10,
    digit: 4,
    trial: 0,
    end: false,
    $question: get(".ball_question"),
    $answer: get(".ball_answer"),
    $input: get(".ball_input"),
  };

  /* 구조분해할당으로 미리 선언해주기  */
  const { limit, digit, $question, $answer, $input } = baseball;
  let { trial, end } = baseball;

  /* 랜덤으로 패스워드 지정해주기  */
  const setPassword = () => {
    const gameLimit = Array(limit).fill(false);
    let password = "";
    while (password.length < digit) {
      const random = parseInt(Math.random() * 10, 10);

      if (gameLimit[random]) {
        continue;
      }
      password += random;
      gameLimit[random] = true;
    }

    baseball.password = password;
  };

  /* 시도했을 때  */
  const onPlayed = (number, hint) => {
    return `<em>${trial}차 시도</em>: ${number}, ${hint}`;
  };

  /* 번호가 같은가?  */
  const isCorrect = (number, answer) => {
    return number === answer;
  };

  /* 중복 번호가 있는가 ?   */
  const isDuplicate = (number) => {
    return [...new Set(number.split(""))].length !== digit;
  };

  /* 스트라이크 카운트는 몇인가?  */
  const getStrikes = (number, answer) => {
    let strike = 0;
    const nums = number.split("");

    nums.map((digit, index) => {
      if (digit === answer[index]) {
        strike++;
      }
    });

    return strike;
  };

  /* 볼 카운트는 몇인가?  */

  const getBalls = (number, answer) => {
    let ball = 0;
    const nums = number.split("");
    const gameLimit = Array(limit).fill(false);

    answer.split("").map((num) => {
      gameLimit[num] = true;
    });

    nums.map((num, index) => {
      if (answer[index] !== num && !!gameLimit[num]) {
        ball++;
      }
    });

    return ball;
  };

  /* 시도에 따른 결과는?  */

  const getResult = (number, answer) => {
    if (isCorrect(number, answer)) {
      end = true;
      $answer.innerHTML = baseball.password;
      return "홈런!!";
    }

    const strikes = getStrikes(number, answer);
    const balls = getBalls(number, answer);

    return "STRIKE: " + strikes + ", BALL: " + balls;
  };

  /* 게임 플레이 */
  const playGame = (event) => {
    event.preventDefault();

    if (!!end) {
      return;
    }

    const inputNumber = $input.value;
    const { password } = baseball;

    if (inputNumber.length !== digit) {
      alert(`${digit}자리 숫자를 입력해주세요.`);
    } else if (isDuplicate(inputNumber)) {
      alert("중복 숫자가 있습니다.");
    } else {
      trial++;
      const result = onPlayed(inputNumber, getResult(inputNumber, password));
      $question.innerHTML += `<span>${result}</span>`;

      if (limit <= trial && !isCorrect(inputNumber, password)) {
        alert("쓰리아웃!");
        end = true;
        $answer.innerHTML = password;
      }
    }

    $input.value = "";
    $input.focus();
  };

  init();
})();
