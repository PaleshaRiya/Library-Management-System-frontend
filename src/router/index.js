import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import LibLoginView from '../views/LibLoginView.vue';
import UserDashbrdView from '../views/UserDashbrdView.vue';
import UdbBooksView from '../views/UdbBooksView.vue';
import SectionBooksUserView from '../views/SectionBooksUserView.vue';
import MyBooksView from '../views/MyBooksView.vue';
import UserProfileView from '../views/UserProfileView.vue';
import LibDashbrdView from '../views/LibDashbrdView.vue';
import AddSectionView from '../views/AddSectionView.vue';
import AddBookView from '../views/AddBookView.vue';
import UpdateBookView from '../views/UpdateBookView.vue';
import UpdateSectionView from '../views/UpdateSectionView.vue';
import SectionBooksView from '../views/SectionBooksView.vue';
import RequestsView from '../views/RequestsView.vue';
import GrantedRequestsView from '../views/GrantedRequestsView.vue';
import LibStatsView from '../views/LibStatsView.vue';
import HomePageView from '../views/HomePageView.vue';
import PaymentPortalView from '../views/PaymentPortalView.vue';
import UsersDetailsView from '../views/UsersDetailsView.vue';

const routes = [
  { path: '/', name: 'HomePage', component: HomePageView},
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/liblogin', name: 'LibLogin', component: LibLoginView },
  { path: '/userdashbrd', name: 'UserDashbrd', component: UserDashbrdView, 
    meta: { requiresAuth: true } },
  { path: '/user/books', name: 'UdbBooks', component: UdbBooksView, meta: { requiresAuth: true } },
  { path: '/user/sectionbooks/:sectionName/:sectionId', name: 'SectionBooksUser', component: SectionBooksUserView,  props: true, meta: { requiresAuth: true } },
  { path: '/user/mybooks', name: 'MyBooks', component: MyBooksView, meta: { requiresAuth: true } },
  { path: '/profile', name: 'UserProfile', component: UserProfileView, meta: { requiresAuth: true } },
  { path: '/libdashbrd', name: 'LibDashbrd', component: LibDashbrdView, meta: { requiresAuth: true } },
  { path: '/lib/addsection', name: 'AddSection', component: AddSectionView, meta: { requiresAuth: true } },
  { path: '/lib/addbook/:sectionName/:sectionId', name: 'AddBook', component: AddBookView, props: true, meta: { requiresAuth: true }},
  { path: '/lib/updatebook/:bookName/:bookId', name: 'UpdateBook', component: UpdateBookView, props: true, meta: { requiresAuth: true }},
  { path: '/lib/updatesection/:sectionName/:sectionId', name: 'UpdateSection', component: UpdateSectionView, props: true, meta: { requiresAuth: true }},
  {
    path: '/lib/sectionbooks/:sectionName/:sectionId', name: 'SectionBooks',
    component: SectionBooksView, props: true, meta: { requiresAuth: true }
  },
  { path: '/lib/requests', name: 'ReqList', component: RequestsView, meta: { requiresAuth: true } },
  { path: '/lib/grantedreqs', name: 'GrantedRequests', component: GrantedRequestsView, meta: { requiresAuth: true } },
  { path: '/lib/stats', name: 'LibStats', component: LibStatsView, meta: { requiresAuth: true } },
  { path: '/payment/:bookName/:bookId', name: 'PaymentPortal', component: PaymentPortalView, props: true, meta: { requiresAuth: true } },
  { path: '/usersdetails', name: 'UsersDetails', component: UsersDetailsView, meta: { requiresAuth: true } },
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token; // Check if token exists

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If route requires auth and user is not authenticated, redirect to login
    if (!isAuthenticated) {
      next({ name: 'HomePage' });
    } else {
      next();
    }
  } else {
    next(); // Always allow access to public routes
  }
});

export default router;
