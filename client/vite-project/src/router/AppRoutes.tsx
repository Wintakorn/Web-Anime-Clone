import { Routes, Route } from 'react-router-dom';
import Homepage from '../page/home';
import MangaDetailPage from '../page/mangapage/[id]/mangaDetail';
import Notfound from '../page/notfound';
import AuthPage from '../components/loginpopup';
import CreateMangaPage from '../page/adminpage/create';
import EditMangaPage from '../page/adminpage/edit';
import CartPage from '../page/cart/Cartpage';
import Profile from '../page/profilepage/profile';
import ProfileSetting from '../page/profilepage/profilesetting';
import ReviewGridPage from '../page/community/picked_review';
import ForumPostPage from '../page/post/postpage';
import CreatePostPage from '../page/post/createpost';
import PostDetail from '../page/post/postdetail';
import Explorepage from '../page/explore/explore';
import Favoritespage from '../page/favorite/favoritepage';



const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<Homepage />} />
      <Route path="/manga/:id" element={<MangaDetailPage />} />

      <Route
        path='login'
        element={
          <AuthPage />
        }
      />
      <Route
        path='register'

      />

      <Route path='/cart' element={<CartPage />} />
      <Route path='/profile' element={<Profile mangaId='' />} />
      <Route path='/profile/:userId' element={<Profile mangaId='' />} />
      <Route path='/profile/ProfileSetting' element={<ProfileSetting />} />

      <Route path='/picked_review' element={<ReviewGridPage />} />

      <Route path='/post' element={<ForumPostPage />} />

      <Route path='/create/post' element={<CreatePostPage />} />

      <Route path='/post/:id' element={<PostDetail />} />

      <Route path='/explore' element={<Explorepage />} />

      <Route path='/favorite' element={<Favoritespage />} />

      <Route
        path='admin'
      >
        <Route path='/admin/create' element={<CreateMangaPage />} />
        <Route path='/admin/edit/:id' element={<EditMangaPage />} />
      </Route>


      <Route path="*" element={<Notfound />} />
    </Routes>

  );
};

export default AppRoutes;
