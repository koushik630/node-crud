-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 01, 2018 at 11:33 PM
-- Server version: 5.7.21-0ubuntu0.16.04.1
-- PHP Version: 7.0.28-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crud_node`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE','ALL') DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'first category', 'wewqewqr', 'ACTIVE', '2018-03-31 00:28:00', NULL),
(2, 'two category', 'wewqewqr', 'ACTIVE', '2018-03-31 00:28:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `productes`
--

CREATE TABLE `productes` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `productes`
--

INSERT INTO `productes` (`id`, `name`, `description`, `product_image`, `status`, `created_at`, `updated_at`) VALUES
(1, 'colgate', 'fdsdsg', NULL, 'ACTIVE', '2018-03-31 00:00:00', '2018-04-01 11:00:15'),
(2, 'Pepsodent', 'fdfd', NULL, 'ACTIVE', '2018-03-31 00:00:00', '2018-03-31 22:37:02'),
(8, 'rrrr', 'bbbbb', NULL, 'ACTIVE', '2018-04-01 13:54:57', '2018-04-01 13:54:57'),
(9, 'pppp', 'hhhhh', NULL, 'ACTIVE', '2018-04-01 13:56:00', '2018-04-01 13:56:00'),
(10, 'pppp', 'uuuuu', NULL, 'ACTIVE', '2018-04-01 14:01:28', '2018-04-01 14:01:28'),
(11, 'oooo', 'pppppp', NULL, 'ACTIVE', '2018-04-01 14:02:02', '2018-04-01 14:02:02');

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`id`, `category_id`, `product_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2018-03-31 00:00:00', '2018-03-31 00:00:00'),
(2, 2, 1, '2018-03-31 00:00:00', '2018-03-31 00:00:00'),
(3, 1, 10, '2018-04-01 14:01:28', '2018-04-01 14:01:28'),
(4, 2, 11, '2018-04-01 14:02:02', '2018-04-01 14:02:02');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `f_name` varchar(255) NOT NULL,
  `l_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `password` text NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `productes`
--
ALTER TABLE `productes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `productes`
--
ALTER TABLE `productes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
