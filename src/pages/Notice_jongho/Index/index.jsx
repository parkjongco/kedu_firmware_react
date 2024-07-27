import styles from './index.module.css';
import SideBar from '../../../components/Jongho/SideBar';
const NoticeIndex = () => {

    return (
        <div className={styles.container}>
            <div className={styles.sub_container}>
                { SideBar("https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg", "박종호", "fjqm212@gmail.com") }
                <div className={styles.category}></div>
                <div className={styles.content}></div>
            </div>
        </div>
    )
}

export default NoticeIndex;