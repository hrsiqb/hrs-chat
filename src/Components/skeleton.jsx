import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Skeleton from '@material-ui/lab/Skeleton';
import React, { Component } from 'react';

class ItemCardSkeleton extends Component {
  render() {
    return (
      <Card className="itemCard-card mt-1 mb-1 mr-2 ml-2" variant="outlined" >
        <CardMedia>
          <Skeleton variant="rect" width={300} height={200} />
        </CardMedia>
        <CardContent>
          <Skeleton />
          <Skeleton width="60%" />
        </CardContent>
      </Card>
    )
  }
}

class ItemMediaSkeleton extends Component {
  render() {
    return (
      <Card className="itemMedia-card m-0" variant="outlined" >
        <CardMedia>
          <Skeleton variant="rect" width={840} height={480} />
        </CardMedia>
        <CardContent className="itemMedia-content mt-3 mb-3">
          <Skeleton className="mr-3 ml-3" variant="rect" width={65} height={65} />
          <Skeleton className="mr-3 ml-3" variant="rect" width={65} height={65} />
          <Skeleton className="mr-3 ml-3" variant="rect" width={65} height={65} />
          <Skeleton className="mr-3 ml-3" variant="rect" width={65} height={65} />
        </CardContent>
      </Card>
    )
  }
}

class ItemDescSkeleton extends Component {
  render() {
    return (
      <Card className="itemDesc-card m-0" variant="outlined" >
        <CardContent className="itemDesc-content mt-1 mb-1 mr-2 ml-2">
          <Skeleton className="mb-2" width="15%" height="40px" />
          <section className="d-f mt-4">
            <Skeleton width="15%" className="mr-9" />
            <Skeleton width="10%" className="mr-9" />
            <Skeleton width="10%" className="mr-9" />
            <Skeleton width="13%" className="mr-9" />
          </section>
          <hr />
          <Skeleton className="mb-2" width="25%" height="40px" />
          <Skeleton />
          <Skeleton width="80%" />
          <Skeleton width="40%" />
          <Skeleton width="90%" />
          <Skeleton width="20%" />
        </CardContent>
      </Card>
    )
  }
}
class ItemDetailSkeleton extends Component {
  render() {
    return (
      <Card className="itemDetail-card m-0" variant="outlined" >
        <CardContent>
          <Skeleton className="mb-2" width="40%" height="50px" />
          <Skeleton width="90%" height="30px" />
          <section className="d-f-sb mt-4">
            <Skeleton width="30%" />
            <Skeleton width="20%" />
          </section>
        </CardContent>
      </Card>
    )
  }
}

class ItemSellerSkeleton extends Component {
  render() {
    return (
      <Card className="itemSeller-card m-0" variant="outlined" >
        <CardContent>
          <Skeleton className="mb-2" width="40%" height="40px" />
          <section className="d-fr ai-c">
            <Skeleton variant="circle" width="60px" height="60px" />
            <section className="ml-2">
              <Skeleton className="" width="110px" height="25px" />
              <Skeleton className="" width="130px" height="20px" />
            </section>
          </section>
          <Skeleton className="mb-2" width="100%" height="70px" />
          <section className="d-fr jc-c">
            <Skeleton width="40%" />
          </section>
        </CardContent>
      </Card>
    )
  }
}

class UserSkeleton extends Component {
  render() {
    return (
      <section className="d-fr ai-c jc-sb m-3">
        <section className="d-fr ai-c">
          <Skeleton variant="circle" width="60px" height="60px" />
          <section className="ml-2">
            <Skeleton className="" width="130px" height="25px" />
            <Skeleton className="" width="150px" height="20px" />
          </section>
        </section>
        <section className="d-fr ai-c">
          <Skeleton className="mr-4" width="60px" height="20px" />
          <Skeleton variant="circle" width="20px" height="20px" />
        </section>
      </section>
    )
  }
}
class MessagesSkeleton extends Component {
  render() {
    return (
      <div>
        <div className="b-l-1gry1 vw-70 h-90p bu-ch">
          <div className="d-fr jc-fe mr-4"><Skeleton animation='wave' width="380px" height="50px" /></div>
          <div className="d-fr jc-fe mr-4"><Skeleton animation='wave' width="300px" height="70px" /></div>
          <div className="ml-4"><Skeleton animation='wave' width="400px" height="60px" /></div>
          <div className="d-fr jc-fe mr-4"><Skeleton animation='wave' width="300px" height="70px" /></div>
          <div className="ml-4"><Skeleton animation='wave' width="260px" height="75px" /></div>
          <div className="d-fr jc-fe mr-4"><Skeleton animation='wave' width="390px" height="55px" /></div>
          <div className="ml-4"><Skeleton animation='wave' width="290px" height="60px" /></div>
          <div className="ml-4"><Skeleton animation='wave' width="360px" height="65px" /></div>
        </div>
        <div className="d-fr jc-sb ai-c b-l-1gry1 vw-70 h-10p bc-gry1 pl-4 pr-4">
          <Skeleton animation='wave' width="95%" height="50px" />
          <Skeleton animation='wave' variant="circle" width="40px" height="40px" />
        </div>
      </div>
    )
  }
}

export {
  ItemCardSkeleton,
  ItemMediaSkeleton,
  ItemDescSkeleton,
  ItemDetailSkeleton,
  ItemSellerSkeleton,
  UserSkeleton,
  MessagesSkeleton
};
