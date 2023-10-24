export const adminMenu = [
    { //Người dùng
        name: 'menu.admin.user', menus: [
            {//crud người dùng
                name: 'menu.admin.crud-user', link: '/admin/manage-user'
            },
            {//đơn hàng
                name: 'menu.admin.manage-orders', link: '/admin/manage-order'
            },
        ]
    },
    { //Sản phẩm
        name: 'menu.admin.product', menus: [
            {
                //sản phẩm
                name: 'menu.admin.manage-product', link: '/admin/manage-product'
            },
            {
                //danh mục
                name: 'menu.admin.manage-category', link: '/admin/manage-category'
            },
            {
                //thương hiệu
                name: 'menu.admin.manage-brand', link: '/admin/manage-brand'
            },
        ]
    },
    { //Biểu ngữ
        name: 'menu.admin.banner', menus: [
            {
                name: 'menu.admin.manage-banner', link: '/admin/manage-banner'
            },
        ]
    },
    { //Chủ đề
        name: 'menu.admin.subject', menus: [
            {
                name: 'menu.admin.manage-subject', link: '/admin/manage-subject'
            },
        ]
    },
    { //Bài đăng
        name: 'menu.admin.blog', menus: [
            {
                name: 'menu.admin.manage-blog', link: '/admin/manage-blog'
            },
        ]
    },
    { //Voucher
        name: 'menu.admin.voucher', menus: [
            {
                name: 'menu.admin.manage-voucher', link: '/admin/manage-voucher',
            },
            {
                name: 'menu.admin.type-voucher', link: '/admin/manage-type-voucher',
            },
        ]
    },
    { //Phương thức vận chuyển
        name: 'menu.admin.ship', menus: [
            {
                name: 'menu.admin.manage-ship', link: '/admin/manage-type-ship'
            },
        ]
    },
    { //Nhập hàng
        name: 'menu.admin.import', menus: [
            {
                name: 'menu.admin.import', link: '/admin/manage-import'
            },
        ]
    },
    { //Thống kê
        name: 'menu.admin.statistical', menus: [
            {
                name: 'menu.admin.website-parameters', link: '/admin/statistical'
            },
        ]
    },
];