const db = require(process.cwd() + '/models');

exports.buyProduct = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;  // 상품 ID와 구매 수량
        const userId = req.user ? req.user.id : null; // 로그인한 경우 userId 저장, 아니면 null

        // products 테이블에서 해당 상품의 정보를 가져옴
        const [product] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);
        console.log(product[0])

        // 구매하려는 수량이 재고보다 많으면 재고 부족 출력
        if (quantity > product[0].quantity) {
            return res.status(400).send('재고가 부족합니다.');
        }

        // 재고 차감 (product의 quantity에서 구매 수량을 빼기)
        await db.execute('UPDATE products SET quantity = quantity - ? WHERE id = ?', [quantity, productId]);
        
        // 남는 상품이 없다면 products 테이블에서 해당 상품 삭제
        const [updatedProduct] = await db.execute('SELECT quantity FROM products WHERE id = ?', [productId]);
        if (updatedProduct[0].quantity === 0) {
            await db.execute('DELETE FROM products WHERE id = ?', [productId]);
            console.log(`삭제되었습니다.`);
        }
        // 로그인한 사용자가 있을 경우 purchases 테이블에 구매 기록 저장
        if (userId) {
            const totalPrice = product[0].price * quantity;  // 총 가격
            await db.execute(
                'INSERT INTO purchases (userId, productName, quantity, totalPrice) VALUES (?, ?, ?, ?)',
                [userId, product[0].name, quantity, totalPrice]
            );
            console.log("totalPrice", totalPrice);
        }
        
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        return next(err);
    }

};

exports.getPurchases = async (req, res, next) => {
    try {
        const userId = req.user.id; 
        // 구매 내역 (상품명, 구매수량, 총 가격) 가져오기
        const [purchases] = await db.execute(`
            SELECT productName, quantity, totalPrice
            FROM purchases
            WHERE userId = ?
            ORDER BY id DESC
        `, [userId]);
        
        // 상품을 구매한 횟수 가져오기
        let purchaseCount = 0;
            if (userId) {
                const [purchases] = await db.execute(`
                    SELECT COUNT(*) AS purchaseCount
                    FROM purchases
                    WHERE userId = ?
                `, [userId]);
                purchaseCount = purchases[0].purchaseCount; 
            }
        res.render('purchased', {
            title: 'My GREEN',
            purchases,
            purchaseCount
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
