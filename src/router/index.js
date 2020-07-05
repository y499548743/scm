import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/sys/Login'
import Index from '@/views/home/Index'
import UserManager from '@/views/user/UserManager'
import AddUser from '@/views/user/AddUser'
import Welcome from '@/views/Welcome'
import SupplierManager from '@/views/purchase/SupplierManager'
import AddSupplier from '@/views/purchase/AddSupplier'
import PomainManager from '@/views/purchase/PomainManager'
import AddPomain from '@/views/purchase/AddPomain'
import CategoryManager from '@/views/sell/CategoryManager'
import AddCategory from '@/views/sell/AddCategory'
import ProductManager from '@/views/sell/ProductManager'
import AddProduct from '@/views/sell/AddProduct'
import ChangePomain from '@/views/purchase/ChangePomain'
import EndPomain from '@/views/purchase/EndPomain'
import SearchPomain from '@/views/purchase/SearchPomain'
import InStock from '@/views/stock/InStock'
import OutStock from '@/views/stock/OutStock'
import CheckStock from '@/views/stock/CheckStock'
import UpdateStock from '@/views/stock/UpdateStock'
import QueryStock from '@/views/stock/QueryStock'
import Receipt from '@/views/finance/Receipt'
import Pay from '@/views/finance/pay'
import Query from '@/views/finance/Query'
import CustomerManager from '@/views/sell/CustomerManager'
import AddCustomer from '@/views/sell/AddCustomer'
import SomainManager from '@/views/sell/SomainManager'
import AddSomain from '@/views/sell/AddSomain'
import ChangeSomain from '@/views/sell/ChangeSomain'
import EndSomain from '@/views/sell/EndSomain'
import SearchSomain from '@/views/sell/SearchSomain'
import PurchaseChart from '@/views/chart/PurchaseChart'
import FinanceChart from '@/views/chart/FinanceChart'
import InstockChart from '@/views/chart/InstockChart'
import OutstockChart from '@/views/chart/OutstockChart'
import StockChart from '@/views/chart/StockChart'
import SellChart from '@/views/chart/SellChart'
import Allow from '@/views/permission/Allow'
import store from '@/store/index'



Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/home',
      component: Index,
      children:[
        {path:'/welcome',component:Welcome,meta:{title: '首页',tag:'管理信息'}},
        {path: '/user/manager', component: UserManager, meta:{
          title: '用户管理',tag:'管理信息'
        }},
        {path:'/user/add',component:AddUser,meta:{title:'添加用户',tag:'管理信息'}},
        {path:'/purchase/suppliermanager',component:SupplierManager,meta:{
          title: '供应商管理',tag:'采购管理'
        }},
        {path:'/purchase/addsupplier',component:AddSupplier,meta:{title:'添加供应商',tag:'采购管理'}},
        {path:'/purchase/pomainmanager',component:PomainManager,meta:{
          title: '新添采购单',tag:'采购管理'
        }},
        {path:'/purchase/addpomain',component:AddPomain,meta:{title:'添加采购单',tag:'采购管理'}},
        {path:'/purchase/changepomain',component:ChangePomain,meta:{title:'修改采购单',tag:'采购管理'}},
        {path:'/purchase/endpomain',component:EndPomain,meta:{title:'采购单了结',tag:'采购管理'}},
        {path:'/sell/categorymanager',component:CategoryManager,meta:{title: '产品分类管理',tag:'销售管理'
          }},
        {path:'/sell/addcategory',component:AddCategory,meta:{title:'添加产品分类',tag:'销售管理'}},
        {path:'/sell/productmanager',component:ProductManager,meta:{title: '产品管理',tag:'销售管理'
          }},
        {path:'/sell/addproduct',component:AddProduct,meta:{title:'添加产品',tag:'销售管理'}},
        {path:'/purchase/searchpomain',component:SearchPomain,meta:{title:'采购单查询',tag:'采购管理'}},
        {path:'/stock/instock',component:InStock,meta:{title:'入库登记',tag:'仓储管理'}},
        {path:'/stock/outstock',component:OutStock,meta:{title:'出库登记',tag:'仓储管理'}},
        {path:'/stock/checkstock',component:CheckStock,meta:{title:'库存盘点',tag:'仓储管理'}},
        {path:'/stock/updatestock',component:UpdateStock,meta:{title:'库存盘点',tag:'仓储管理'}},
        {path:'/stock/querystock',component:QueryStock,meta:{title:'库存查询',tag:'仓储管理'}},
        {path:'/finance/receipt',component:Receipt,meta:{title:'收款登记',tag:'财务收支'}},
        {path:'/finance/pay',component:Pay,meta:{title:'付款登记',tag:'财务收支'}},
        {path:'/finance/query',component:Query,meta:{title:'收支查询',tag:'财务收支'}},
        {path:'/sell/customermanager',component:CustomerManager,meta:{title:'客户管理',tag:'销售管理'}},
        {path:'/sell/addcustomer',component:AddCustomer,meta:{title:'添加客户',tag:'销售管理'}},
        {path:'/sell/somainmanager',component:SomainManager,meta:{title:'新添销售单',tag:'销售管理'}},
        {path:'/sell/addsomain',component:AddSomain,meta:{title:'添加销售单',tag:'销售管理'}},
        {path:'/sell/changesomain',component:ChangeSomain,meta:{title:'修改销售单',tag:'销售管理'}},
        {path:'/sell/endsomain',component:EndSomain,meta:{title:'销售单了结',tag:'销售管理'}},
        {path:'/sell/searchsomain',component:SearchSomain,meta:{title:'销售单查询',tag:'销售管理'}},
        {path:'/chart/purchasechart',component:PurchaseChart,meta:{title:'月度采购报表',tag:'业务报表'}},
        {path:'/chart/financechart',component:FinanceChart,meta:{title:'月度收支报表',tag:'业务报表'}},
        {path:'/chart/instockchart',component:InstockChart,meta:{title:'月度入库报表',tag:'业务报表'}},
        {path:'/chart/outstockchart',component:OutstockChart,meta:{title:'月度出库报表',tag:'业务报表'}},
        {path:'/chart/stockchart',component:StockChart,meta:{title:'月度库存报表',tag:'业务报表'}},
        {path:'/chart/sellchart',component:SellChart,meta:{title:'月度销售报表',tag:'业务报表'}},
        {path: '/deny', component: Allow}
      ],
      meta: { // 路由的元信息
        requireLogin: true
      }
    }
  ]
})

router.beforeEach((to, from , next) => {
  // 要访问的路由路径
  const path = to.path
  console.log(to,111)
  if(path.startsWith('/purchase/') && store.state.user.models.find(model => model.modelCode === 1)){
    next()
  }else if(path.startsWith('/sell/') && store.state.user.models.find(model => model.modelCode === 2)){
    next()
  }else if(path.startsWith('/user/') && store.state.user.models.find(model => model.modelCode === 3)){
    next()
  }else if(path.startsWith('/finance/') && store.state.user.models.find(model => model.modelCode === 4)){
    next()
  }else if(path.startsWith('/stock/') && store.state.user.models.find(model => model.modelCode === 5)){
    next()
  }else if(path.startsWith('/chart/') && store.state.user.models.find(model => model.modelCode === 6)){
    next()
  }else if(path === '/' ){
    next()
  }else if((path === '/home'|| path === '/deny'||path==='/welcome') && store.state.user){
    next()
  }else {
    next('/deny')
  }

})
export default router