import React, {
    Component,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableHighlight,
    View,
    ListView
} from "react-native";
import { Boris, Button, Loader, ScrollListView, Topic } from "../../components";
import { connect } from "react-redux";
import styles from "./style";
import { _flex } from "../../styles/base";


const BorisNoteForSubscription = "Don’t restrain yourself with 3 topics, meatb… Master. Subscribe and unlock the full power of your Virtual Mentor!";
const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

class ExploreTopics extends Component {

  constructor (props) {
    super(props)

    this.state = {
      loader: true,
      isLoadingTail: false,
      showConfirmation: false
    };
  }

  componentDidMount () {
    setTimeout(()=> {
      this.setState({ loader: false })
    }, 1000)
  }

  componentWillMount () {

  }

  componentWillUnmount () {

  }


  _selectTopic (id) {
    const { dispatch, navigator } = this.props;

    setTimeout(()=> {
      navigator.push({
        scene: 'advice_for_me',
        title: '',
        topicId: id
      })
    }, 0)
  }


  _onEndReached () {
    let { dispatch } = this.props;
  }

  subscribeNow () {

  }

  render () {
    const { user, topics } = this.props;
    const { loader, isLoadingTail } = this.state;

    if ( loader ) {
      return <Loader />
    }

    return (
        <View style={styles.container}>
          <ScrollView ref="_scrollView" showsVerticalScrollIndicator={false}>
            <ListView
                dataSource={dataSource.cloneWithRows(topics.list)}
                renderRow={(rowData, sectionID, rowID) => {
                  return <Topic {...rowData} index={rowID} selectTopic={this._selectTopic.bind(this)}/>
                }}
                pageSize={14}
                isLoadingTail={isLoadingTail}
                onEndReached={this._onEndReached.bind(this)}
                onEndReachedThreshold={20}
                showsVerticalScrollIndicator={false}
                style={ _flex}
            />

            <ButtonsBoris subscribeNow={this.subscribeNow.bind(this)}/>
          </ScrollView>
        </View>
    )
  }
}

const ButtonsBoris = (props) => (
    <View style={ {marginTop : 40 } }>
      <View style={ styles.borisContainer }>
        <Boris mood="positive" size="small" note={ BorisNoteForSubscription }/>
      </View>
      <Button
          onPress={props.subscribeNow}
          label=""
          color="orange"
          style={ styles.button }>
        <Text style={ styles.buttonText }>Subscribe now</Text>
      </Button>
    </View>
)


export default connect(state => ({
  user: state.user,
  topics: state.topics,
}))(ExploreTopics)
