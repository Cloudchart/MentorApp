const settings = (state = {
  list: [
    {
      id: 0,
      name: 'Profile',
      screen: 'profile'
    },
    {
      id: 1,
      name: 'Explore',
      screen: 'explore-topic'
    },
    {
      id: 2,
      name: 'Your topics',
      screen: 'user-topics'
    },
    {
      id: 3,
      name: 'Subscription',
      screen: 'subscription'
    }
  ]
}, action) => {
  switch ( action.type ) {
    default:
      return { ...state }
  }
}

export default settings;
