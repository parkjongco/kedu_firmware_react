import React from 'react';
import styles from './Approval_List.module.css';

const ApprovalListModal = ({ onClose, approvalList, handleApprove, handleReject }) => {
  const usersName = sessionStorage.getItem('usersName');
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>승인 리스트</h2>
        <ul>
          {approvalList.length > 0 ? (
            approvalList.map((item, index) => (
              <li key={item.usersUpdateRequestSeq || index}>
                <div>
                  <p>{usersName || '이름 없음'} - {item.requestReason || '사유 없음'}</p>
                  <p>상태: {item.requestStatus || '대기 중'}</p>
                  <p>요청 일시: {new Date(item.requestTimestamp).toLocaleString()}</p>
                </div>
                <div className={styles.adminActions}>
                  <button className={styles.approveButton} onClick={() => handleApprove(item.usersUpdateRequestSeq)}>승인</button>
                  <button className={styles.rejectButton} onClick={() => handleReject(item.usersUpdateRequestSeq)}>거부</button>
                </div>
              </li>
            ))
          ) : (
            <p>대기 중인 요청이 없습니다.</p>
          )}
        </ul>
        <button className={styles.closeButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ApprovalListModal;
