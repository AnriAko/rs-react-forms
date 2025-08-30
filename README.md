## Perfomance report:

### Same actions screenshot comparison(first is with memo and second without):

1.  <img width="786" height="185" alt="image" src="https://github.com/user-attachments/assets/aeeb7ffd-0dca-43dd-91b7-caee35850511" />

<img width="789" height="183" alt="image" src="https://github.com/user-attachments/assets/be01c7ed-68f6-4185-9296-2d47f870dd16" />

2.  <img width="789" height="251" alt="image" src="https://github.com/user-attachments/assets/714b39f5-d6d7-41d5-9a6e-76c2c41fee1a" />

<img width="787" height="252" alt="image" src="https://github.com/user-attachments/assets/ef73bb72-ca39-4233-82ad-987a8cd7ab47" />

3.  <img width="786" height="259" alt="image" src="https://github.com/user-attachments/assets/3cdf7e4a-712b-4b31-9abc-705f4d2020c7" />

<img width="787" height="255" alt="image" src="https://github.com/user-attachments/assets/82709f3c-38b9-4630-8e27-104f9bf58eb4" />

4.  <img width="790" height="259" alt="image" src="https://github.com/user-attachments/assets/53a49ccd-a915-42fe-8b18-38ac969fba56" />

<img width="787" height="257" alt="image" src="https://github.com/user-attachments/assets/2cc9f74b-47b0-4797-9e20-f3f3a1666fce" />

### Overall comparison:

#### 1. First render:

For "memo" took 12.4ms when for "noMemo" it took 10.5ms.
First render is slower due to additional logic with memo

#### 2. CountriesTableComponent:

Render on average with "memo" took ~296–361 ms when "noMemo" took ~289–360,
but there was much less unneccesary renders.

#### 3. CountriesFiltersMenu:

Each filters update took about ~43–47 ms for "memo" and ~38-40ms for "noMemo",
but updating filters was not causing table to rerender (e.g when changing columns)

#### 4. DataView:

Combined updates was close to ~585ms for "memo" and ~518ms for "noMemo"

#### 5. Result:

First render: faster without memo.

Frequent filter updates: wins with memo → table is not redrawn the first time.

Heavy operations (DataView + table): may be a bit slower with memo.

General optimization: reducing the number of unnecessary renderings,
which is important for large tables or many small updates.
