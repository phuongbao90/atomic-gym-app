
## Text
### regex
```js
pager-dot-1
pager-dot-2
pager-dot-3

// regex to get all
getAllByTestId(/^pager-dot-/)
```


## List
### mocking flatlist - onRefresh 
```javascript
    const flatListTestInstance = screen.getByLabelText('dishes-list');
    const {refreshControl} = flatListTestInstance.props;
    
    await act(async () => {
        refreshControl.props.onRefresh();
    });
```

### mocking onEndReact
```javascript
    const list = screen.getByTestId("exercises-list");
    const { onEndReached } = list.props;

    act(() => {
        onEndReached?.({ distanceFromEnd: 0 });
    });
```

