const db = require(process.cwd() + '/models');

exports.afterUploadImage = (req, res) => {
    // client에게 json 형식의 데이터 전달
    res.json({ url: `/img/${req.file.filename}` });  
};

exports.uploadPost = async (req, res, next) => {
    try {
        // Client에게서 상품이름, 상품 코드, 수량, 가격, 이미지(선택) 정보를 받고 products테이블에 등록
        const { name, code, quantity, price, img } = req.body; 
        const imageUrl = req.body.url || null; 

        const [result] = await db.execute(`
            INSERT INTO products (name, code, quantity, price, img) 
            VALUES (?, ?, ?, ?, ?)`,
            [name, code, quantity, price, imageUrl]
        );

        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

