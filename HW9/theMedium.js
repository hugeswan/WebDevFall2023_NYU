console.log("theMessage");

const theButton = document.querySelector("button");
const theInput = document.querySelector("input")
let theDivider = document.querySelector("div")

theButton.addEventListener('click', makeList)

function makeList() {
    console.log("click!");
    let theUserWords = theInput.value;
    if (theUserWords.trim() === '') { // 입력값이 비어있지 않은지 확인
        console.log("No input provided!");
        return; // 입력값이 비어있으면 함수 종료
    }
    let theItem = document.createElement('li')
    theItem.textContent = theUserWords; // 텍스트 노드 생성 대신 textContent 사용
    theDivider.appendChild(theItem);
    
    // 삭제 버튼 추가
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.onclick = function() {
        theDivider.removeChild(theItem);
    };
    theItem.appendChild(deleteBtn);
    
    // 항목을 클릭하면 완료 표시를 하는 이벤트 리스너 추가
    theItem.addEventListener('click', function() {
        theItem.classList.toggle('completed');
    });

    theInput.value = ''; // 입력 필드 초기화
}

document.querySelector("p").addEventListener('click', eraseList)

function eraseList(){
    console.log("erase!");
    // div 안의 모든 자식 li 요소들을 제거합니다.
    while (theDivider.firstChild) {
        theDivider.removeChild(theDivider.firstChild);
    }
}
