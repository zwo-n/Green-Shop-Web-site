const db = require(process.cwd() + '/models');

// 회원가입 페이지 렌더링
exports.renderJoin = (req, res) => {
    // 페이지 렌더링과 함께 client에게 템플릿 전달
    res.render('join', { title: 'Join' });
};

// 메인 화면 렌더링
exports.renderMain = async (req, res, next) => {
    try {
        // 카테고리 검색란의 입력이 있다면 해당 카테고리 상품만 가져오기
        // 아니라면 모든 상품을 가져오기
        const queryTag = req.query.category;
        const userId = req.user ? req.user.id : null;
        let productsQuery = `
            SELECT p.id, p.name, p.quantity, p.price, p.img
            FROM products p`;

         if (queryTag) {
            productsQuery += ` WHERE p.code LIKE ? ORDER BY p.createdAt DESC`; 
        } else {
            productsQuery += ` ORDER BY p.createdAt DESC`; 
        }

        const [products] = await db.execute(productsQuery, [queryTag ? `%${queryTag}%` : '']);
        
        // 로그인 한 유저라면 상품 구매 횟수 가져오기
        let purchaseCount = 0;
        if (userId) {
            const [purchases] = await db.execute(`
                SELECT COUNT(*) AS purchaseCount
                FROM purchases
                WHERE userId = ?
            `, [userId]);
            purchaseCount = purchases[0].purchaseCount; 
        }
        // 가장 최근에 구매가 이루어진 상품 가져오기
        const [latest] = await db.execute(`
            SELECT * FROM purchases 
            ORDER BY purchaseDate DESC 
            LIMIT 1
        `);
        // 코드명 가져오기 (겹치는 값은 하나만)
        const [categories] = await db.execute(`SELECT DISTINCT code FROM products;`);
        const latestP = latest.length > 0 ? latest[0] : null;
        // 페이지 렌더링과 함께 client에게 템플릿 전달
        res.render('main', {
            title: 'Products',
            user: req.user,
            products,
            purchaseCount,
            latestP,
            categories  
        });

        console.log('Products:', products);
        
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.renderUpload =async (req,res)=>{
    const userId = req.user ? req.user.id : null;
    let purchaseCount = 0;
        if (userId) {
            const [purchases] = await db.execute(`
                SELECT COUNT(*) AS purchaseCount
                FROM purchases
                WHERE userId = ?
            `, [userId]);
            purchaseCount = purchases[0].purchaseCount; 
        }
    // 페이지 렌더링과 함께 client에게 템플릿 전달
    res.render('upload', { title: 'Upload', user: req.user,purchaseCount });
};

exports.renderLogin =(req,res)=>{
    // 페이지 렌더링과 함께 client에게 템플릿 전달
    res.render('login',{title:"Login"});
}