const router = require('express').Router();
const { Post, User } = require('../../models');

// get all users 
router.get('/', (req,res) => {
    console.log('======================');
    Post.findAll({
        // Query configuration
        attributes: ['id', 'post_url', 'title', 'created_at'],
        order: [['created_at', 'DESC']],
        //include the JOIN to the user table
        include: [ 
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostdata => res.json(dbPostdata))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// get one user 
router.get('/:id', (req,res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at'],
        include: [
            { 
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostdata => {
        if(!dbPostdata) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostdata);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// POST to add to post data
router.post('/', (req,res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    .then(dbPostdata => {res.json(dbPostdata)})
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// update a Post's title
router.put('/:id', (req,res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id:req.params.id
            }
        }
    )
    .then(dbPostdata => {
        if(!dbPostdata) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostdata);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// Delete a Post 
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostdata => {
        if(!dbPostdata) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostdata);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

module.exports = router;