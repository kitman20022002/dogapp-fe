import React from 'react';
import {Paper, IconButton, Container, CircularProgress, Box} from "@material-ui/core";
import {Search} from '@material-ui/icons';
import "./Home.css";
import {getDog} from "../../api/dog";
import {getErrorMessage} from "../../utility";
import {LazyImage} from "../../component/LazyImage/LazyImage";
//https://medium.com/@albertjuhe/an-easy-to-use-performant-solution-to-lazy-load-images-in-react-e6752071020c
class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search:'',
            products: [],
            checkForget: false,
            checked: true,
            images: "",
            errorMessage: "",
            isLoading: false,
            cacheData: []
        };
    }

    hasCache(value) {
        return this.state.cacheData.hasOwnProperty(value);
    }

    handleSubmit = async (e) => {
        this.setState({isLoading: true});
        e.preventDefault();
        let res = {};
        let searchValue = this.state.search.toLowerCase();
        const cache = this.state.cacheData;

        try {
            //afghan
            if (!this.hasCache(searchValue)) {
                res = await getDog(searchValue);
                cache[searchValue] = res.data.message;
            }

            res = cache[searchValue];
            this.setState({products: res, errorMessage: '', isLoading: false, cache: cache});
        } catch (err) {
            this.setState({errorMessage: getErrorMessage(err.response.status), isLoading: false});
        }
    };

    onChange = (e) => {
        this.setState({[e.target.name]:e.target.value, errorMessage: ''});
    };

    render() {
        return (
            <div>
                <Container fixed>
                    <h1>Search Dog App</h1>
                    <Paper component="form" className={"form"} onSubmit={this.handleSubmit}>
                        <input
                            name={"search"}
                            onChange={this.onChange}
                            value={this.state.search}
                            placeholder="Search Products"
                            data-testid={'input-search'}
                        />
                        <IconButton type="submit" className={"v"} aria-label="search" data-testid={'search'}>
                            <Search/>
                        </IconButton>
                    </Paper>
                    {this.state.errorMessage && <h3 className="error"> {this.state.errorMessage} </h3>}
                    {this.state.isLoading ?
                        <Box display="flex"
                             width={"100%"} height={"80vh"}
                             alignItems="center"
                             justifyContent="center">
                            <CircularProgress/>
                        </Box>
                        : this.state.products.map((url, index) => <LazyImage key={index} src={url} alt={"dog" + index}/>)}
                </Container>
            </div>
        )
    }
}


export default Home;
