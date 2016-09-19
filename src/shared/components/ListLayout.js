import React, {Component} from 'react';
import CategorizedCardList from '../containers/CategorizedCardList';
import AddCard from '../containers/AddCard';

class ListLayout extends Component {
  render() {
    return (
			<div>
				<AddCard />
				<CategorizedCardList />
			</div>
		);
  }
}

export default ListLayout;
