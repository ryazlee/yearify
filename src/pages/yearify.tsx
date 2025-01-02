
import Yearify from '../components/yearify/Yearify';
import { Header } from '../components/shared/Header';
import { Footer } from '../components/shared/Footer';
import { Body } from '../components/shared/Body';
import { NavDrawer } from '../components/NavDrawer';
import { Page } from '../components/shared/Page';

const YearifyPage = () => {
    return (
        <Page>
            <Header />
            <Body>
                <Yearify />
                <NavDrawer />
            </Body>
            <Footer />
        </Page>
    );
};

export default YearifyPage;

