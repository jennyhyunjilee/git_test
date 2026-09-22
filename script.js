// script.js
// 프로그래밍 핵심 개념 5가지 실습 - 단계별 학습 코드
// index.html의 01~05 섹션과 번호를 맞춰서 정리했습니다.

// ===============================================
// 01. 변수 (Variable): 데이터 담기
// ===============================================
const varUserIdInput = document.querySelector('#var-userid');
const varPriceInput = document.querySelector('#var-price');
const varQuantityInput = document.querySelector('#var-quantity');
const varBtn = document.querySelector('#var-btn');
const varOutput = document.querySelector('#var-output');

varBtn.addEventListener('click', function () {
    // input.value는 항상 문자열이므로, 숫자 계산이 필요한 값은 Number()로 바꿔줍니다.
    const userId = varUserIdInput.value;
    const price = Number(varPriceInput.value);
    const quantity = Number(varQuantityInput.value);

    // 변수끼리 계산해서 새로운 값(total)을 만듭니다.
    const total = price * quantity;
    const now = new Date();

    varOutput.textContent =
        `${userId || '(아이디 없음)'}님의 장바구니 총액은 ${total.toLocaleString()}원입니다. ` +
        `(계산 시각: ${now.toLocaleTimeString()})`;
});

// ===============================================
// 02. 조건문 (if): 분기
// ===============================================
const ifPasswordInput = document.querySelector('#if-password');
const ifBtn = document.querySelector('#if-btn');
const ifOutput = document.querySelector('#if-output');

const correctPassword = '1234'; // 실습용으로 미리 정해둔 정답 비밀번호

ifBtn.addEventListener('click', function () {
    const inputPassword = ifPasswordInput.value;

    // 조건에 따라 프로그램이 서로 다른 코드를 실행합니다.
    if (inputPassword === '') {
        ifOutput.textContent = '비밀번호를 입력해주세요.';
        ifOutput.className = 'output error';
    } else if (inputPassword === correctPassword) {
        ifOutput.textContent = '로그인 성공! 환영합니다.';
        ifOutput.className = 'output success';
    } else {
        ifOutput.textContent = '비밀번호가 틀렸습니다. 다시 시도해주세요.';
        ifOutput.className = 'output error';
    }
});

// ===============================================
// 03. 반복문 (loop): 반복
// ===============================================
const loopCountInput = document.querySelector('#loop-count');
const loopBtn = document.querySelector('#loop-btn');
const loopOutput = document.querySelector('#loop-output');

loopBtn.addEventListener('click', function () {
    const count = Number(loopCountInput.value);

    // 이전에 만들어둔 목록을 비우고 새로 시작합니다.
    loopOutput.innerHTML = '';

    if (count <= 0) {
        loopOutput.innerHTML = '<li>1 이상의 숫자를 입력해주세요.</li>';
        return;
    }

    // for 반복문: count번 만큼 같은 코드를 반복해서 실행합니다.
    for (let i = 1; i <= count; i++) {
        const li = document.createElement('li');
        li.textContent = `${i}번째 게시글입니다.`;
        loopOutput.appendChild(li);
    }
});

// ===============================================
// 04. 함수 (Function): 묶기
// ===============================================
const funcOutput = document.querySelector('#func-output');

// 결제 처리 로직을 함수로 한 번만 만들어두고, 여러 곳에서 재사용합니다.
function processPayment(itemName, amount) {
    if (!itemName || !amount || amount <= 0) {
        return '상품명과 금액을 올바르게 입력해주세요.';
    }
    return `${itemName} 결제 완료: ${Number(amount).toLocaleString()}원`;
}

document.querySelector('#func-coffee-btn').addEventListener('click', function () {
    // 같은 함수를 서로 다른 값으로 재사용 (1)
    funcOutput.textContent = processPayment('커피', 4500);
});

document.querySelector('#func-book-btn').addEventListener('click', function () {
    // 같은 함수를 서로 다른 값으로 재사용 (2)
    funcOutput.textContent = processPayment('책', 15000);
});

document.querySelector('#func-custom-btn').addEventListener('click', function () {
    const itemName = document.querySelector('#func-item').value;
    const amount = document.querySelector('#func-amount').value;

    // 사용자가 입력한 값으로도 똑같은 함수를 그대로 재사용합니다.
    funcOutput.textContent = processPayment(itemName, amount);
});

// ===============================================
// 05. 데이터 타입 (Type): 구분
// ===============================================
const typeOutput = document.querySelector('#type-output');

document.querySelector('#type-number-btn').addEventListener('click', function () {
    const value = 123;
    typeOutput.textContent = `값: ${value} / 타입: ${typeof value}`;
});

document.querySelector('#type-string-btn').addEventListener('click', function () {
    const value = '123';
    typeOutput.textContent = `값: "${value}" / 타입: ${typeof value}`;
});

document.querySelector('#type-boolean-btn').addEventListener('click', function () {
    const value = true;
    typeOutput.textContent = `값: ${value} / 타입: ${typeof value}`;
});

document.querySelector('#type-plus-number-btn').addEventListener('click', function () {
    // 숫자끼리 더하면 진짜 덧셈이 됩니다.
    const result = 123 + 1;
    typeOutput.textContent = `123 + 1 = ${result}  (숫자 덧셈, 타입: ${typeof result})`;
});

document.querySelector('#type-plus-string-btn').addEventListener('click', function () {
    // 문자열과 숫자를 +로 연결하면, 숫자가 문자열로 바뀌어 이어붙여집니다.
    const result = '123' + 1;
    typeOutput.textContent = `"123" + 1 = "${result}"  (문자열 이어붙이기, 타입: ${typeof result})`;
});
