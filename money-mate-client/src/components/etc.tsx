// 엑셀 업로드 확장자 처리
export const checkFileChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  accept?: string
) => {
  console.log('체크=엑셀파일업로드=', e);

  const file = e.target.files?.[0];
  if (!file) return;

  // 기본 허용 타입 (엑셀 전용)
  const defaultAccept = accept ?? '.xls, .xlsx';
  const splitAccept = defaultAccept.split(', ');

  // 확장자 리스트를 clean하게 변환
  const acceptedTypes = splitAccept.map((item) => {
    const type = item.replace('.', '');
    return type;
  });

  console.log('acceptedTypes', acceptedTypes);

  // 실제 파일 확장자 추출
  const fileType = file.name.split('.').pop()?.toLowerCase();
  console.log('fileType', fileType);

  // 파일 형식 체크
  if (!fileType || !acceptedTypes.includes(fileType)) {
    alert(
      `허용되지 않는 파일 형식입니다.\n허용된 형식: ${defaultAccept}\n현재 선택한 확장자: .${fileType}`
    );
    e.target.value = ''; // 초기화
    return;
  }
  // 정상 업로드 가능할 때 파일명 세팅
  console.log('엑셀 업로드 성공:', file.name);
};