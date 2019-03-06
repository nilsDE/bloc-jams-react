import React, { Component } from 'react';
import albumData from './../data/albums';

class Album extends Component {
  constructor(props) {
    super(props);
  
    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      isPlaying: false,
      songHasMouseOver: album.songs[0],
      hasMouseOver: false 
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;

  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if(this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if(!isSameSong) {this.setSong(song);}
      this.play();
    }
  }

  mouseEnter(song) {
    this.setState({ songHasMouseOver: song,
                    hasMouseOver: true });
  }

  mouseOut() {this.setState({ hasMouseOver: false })};

  giveInfo(song, index) {
    if (this.state.currentSong === song && this.state.isPlaying === true) {
      return <i class="icon ion-md-pause"></i>;
    } else if (this.state.currentSong === song && this.state.isPlaying === false) {
      return <i class="icon ion-md-play"></i>;
    } else if (this.state.songHasMouseOver === song && this.state.hasMouseOver === true) {
      return <i class="icon ion-md-play"></i>;
    } else {
      return index + 1;
    }
  }

  render() {
    return (
      <section className="album">
        <section id="album-info">
        <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list">
           <colgroup>
             <col id="song-number-column" />
             <col id="song-title-column" />
             <col id="song-duration-column" />
           </colgroup>  
           <tbody>
             {
               this.state.album.songs.map((song, index) => 
                <tr className="song" key={index} onClick={() => this.handleSongClick(song)} 
                    onMouseEnter={() => this.mouseEnter(song)} onMouseLeave={() => this.mouseOut()}>
                  <td>{this.giveInfo(song, index)}</td>
                  <td>{song.title}</td>
                  <td>{`${song.duration} seconds`}</td>
                </tr>
               )
             }
           </tbody>
         </table>  
      </section>
    );
  }
}

export default Album;