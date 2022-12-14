const router = require('express').Router();
const { Post, User, Vote, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

// get all users 
router.get('/', (req,res) => {
    console.log('======================');
    Post.findAll({
        // Query configuration
        attributes: [
        'id', 
        'post_url', 
        'title', 
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
        order: [['created_at', 'DESC']],
        //include the JOIN to the user table
        include: [ 
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                  model: User,
                  attributes: ['username']
                }
            },
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
        attributes: ['id', 
        'post_url', 
        'title', 
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
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
router.post('/', withAuth, (req,res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.session.user_id
    })
    .then(dbPostdata => {res.json(dbPostdata)})
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// PUT /api/posts/upvote
router.put('/upvote', withAuth, (req, res) => {
    // custom static method created in models/Post.js
    if (req.session) {
      Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
        .then(updatedVoteData => res.json(updatedVoteData))
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    }
  });

// update a Post's title
router.put('/:id', withAuth, (req,res) => {
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
router.delete('/:id', withAuth, (req, res) => {
    console.log('id', req.params.id);
    console.log("req-params", req.params.id);
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});



module.exports = router;
